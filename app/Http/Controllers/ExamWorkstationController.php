<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Exam\SaveAnswerRequest;
use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ExamWorkstationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get enrolled course IDs for the student
        $enrolledCourseIds = $user->enrolledCourses()->pluck('courses.id');

        $exams = Exam::query()
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_active', true)
            ->with(['course:id,name,code', 'teacher:id,name'])
            ->with(['attempts' => function ($q) use ($user): void {
                $q->where('student_id', $user->id);
            }])
            ->latest('start_at')
            ->get()
            ->map(function (Exam $exam): array {
                $attempt = $exam->attempts->first();
                $now = now();

                $isAvailable = $now->gte($exam->start_at) && $now->lte($exam->end_at);
                $status = 'upcoming';

                if ($attempt) {
                    $status = $attempt->status === 'submitted' ? 'completed' : 'in_progress';
                } elseif ($isAvailable) {
                    $status = 'ready';
                } elseif ($now->gt($exam->end_at)) {
                    $status = 'expired';
                }

                return [
                    'id' => $exam->id,
                    'name' => $exam->name,
                    'course_name' => $exam->course->name,
                    'course_code' => $exam->course->code,
                    'teacher_name' => $exam->teacher->name,
                    'start_at' => $exam->start_at->translatedFormat('d M Y, H:i'),
                    'end_at' => $exam->end_at->translatedFormat('d M Y, H:i'),
                    'duration_minutes' => $exam->duration_minutes,
                    'status' => $status,
                    'attempt' => $attempt ? [
                        'id' => $attempt->id,
                        'status' => $attempt->status,
                        'started_at' => $attempt->started_at->toIso8601String(),
                        'score' => $exam->show_result ? $attempt->score : null,
                    ] : null,
                ];
            });

        return Inertia::render('student/exams/index', [
            'exams' => $exams,
        ]);
    }

    public function start(Request $request, Exam $exam): RedirectResponse
    {
        Gate::authorize('takeExam', $exam);

        $user = $request->user();

        // Find or create attempt
        $attempt = ExamAttempt::firstOrCreate(
            [
                'exam_id' => $exam->id,
                'student_id' => $user->id,
            ],
            [
                'started_at' => now(),
                'status' => 'in_progress',
            ]
        );

        if ($attempt->status === 'submitted') {
            return redirect()->route('student.exams.success', $exam);
        }

        return redirect()->route('student.exams.workstation', $exam);
    }

    public function showWorkstation(Request $request, Exam $exam): Response|RedirectResponse
    {
        $user = $request->user();

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $user->id)
            ->first();

        if (! $attempt) {
            return redirect()->route('student.exams.index')
                ->with('error', 'Silakan mulai pengerjaan ujian terlebih dahulu.');
        }

        if ($attempt->status === 'submitted') {
            return redirect()->route('student.exams.success', $exam);
        }

        // Calculate time left in seconds
        $allocatedEndTime = $attempt->started_at->copy()->addMinutes($exam->duration_minutes);
        $hardEndTime = $exam->end_at;
        $effectiveEndTime = $allocatedEndTime->lt($hardEndTime) ? $allocatedEndTime : $hardEndTime;

        $remainingSeconds = (int) now()->diffInSeconds($effectiveEndTime, false);

        // If time has elapsed, auto-submit attempt
        if ($remainingSeconds <= 0) {
            $this->finalizeAttempt($attempt, $exam);

            return redirect()->route('student.exams.success', $exam)
                ->with('info', 'Waktu ujian telah berakhir. Jawaban Anda telah dikumpulkan otomatis.');
        }

        // Load ordered questions with media and options
        $exam->load(['package.questions' => function ($q): void {
            $q->with(['options', 'media'])->orderByPivot('order');
        }]);

        $questionsCollection = $exam->package->questions;

        if ($exam->shuffle_questions) {
            // Consistent deterministic shuffle based on attempt id
            $questionsCollection = $questionsCollection->shuffle($attempt->id);
        }

        $questions = $questionsCollection->map(function (Question $q, int $index): array {
            return [
                'index' => $index + 1,
                'id' => $q->id,
                'text' => $q->text,
                'difficulty' => $q->difficulty,
                'image_url' => $q->getFirstMediaUrl('image') ?: null,
                'options' => $q->options->map(fn (QuestionOption $opt): array => [
                    'id' => $opt->id,
                    'label' => $opt->label,
                    'text' => $opt->text,
                    'image_url' => $opt->getFirstMediaUrl('image') ?: null,
                ])->values()->all(),
            ];
        })->values()->all();

        // Load existing answers saved for this attempt
        $answers = $attempt->answers()->get()->keyBy('question_id')->map(function (ExamAnswer $ans): array {
            return [
                'selected_option_id' => $ans->selected_option_id,
                'is_flagged' => $ans->is_flagged,
                'answered_at' => $ans->answered_at?->toIso8601String(),
            ];
        })->all();

        return Inertia::render('student/exams/workstation', [
            'exam' => [
                'id' => $exam->id,
                'name' => $exam->name,
                'duration_minutes' => $exam->duration_minutes,
            ],
            'attempt' => [
                'id' => $attempt->id,
                'started_at' => $attempt->started_at->toIso8601String(),
                'remaining_seconds' => $remainingSeconds,
            ],
            'questions' => $questions,
            'initialAnswers' => $answers,
        ]);
    }

    public function saveAnswer(SaveAnswerRequest $request, Exam $exam): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->firstOrFail();

        $questionId = (int) $validated['question_id'];
        $selectedOptionId = ! empty($validated['selected_option_id']) ? (int) $validated['selected_option_id'] : null;
        $isFlagged = (bool) ($validated['is_flagged'] ?? false);

        $isCorrect = null;
        if ($selectedOptionId) {
            $option = QuestionOption::where('id', $selectedOptionId)
                ->where('question_id', $questionId)
                ->first();

            $isCorrect = $option?->is_correct ?? false;
        }

        $answer = ExamAnswer::updateOrCreate(
            [
                'attempt_id' => $attempt->id,
                'question_id' => $questionId,
            ],
            [
                'selected_option_id' => $selectedOptionId,
                'is_correct' => $isCorrect,
                'is_flagged' => $isFlagged,
                'answered_at' => now(),
            ]
        );

        return response()->json([
            'status' => 'saved',
            'answered_at' => $answer->answered_at?->toIso8601String(),
        ]);
    }

    public function submit(Request $request, Exam $exam): RedirectResponse
    {
        $user = $request->user();

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->firstOrFail();

        $this->finalizeAttempt($attempt, $exam);

        return redirect()->route('student.exams.success', $exam)
            ->with('success', 'Ujian berhasil diserahkan.');
    }

    public function success(Request $request, Exam $exam): Response|RedirectResponse
    {
        $user = $request->user();

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('student_id', $user->id)
            ->where('status', 'submitted')
            ->first();

        if (! $attempt) {
            return redirect()->route('student.exams.index');
        }

        $totalQuestions = $exam->package->questions()->count();
        $correctCount = $attempt->answers()->where('is_correct', true)->count();
        $incorrectCount = $attempt->answers()->where('is_correct', false)->whereNotNull('selected_option_id')->count();
        $unansweredCount = $totalQuestions - ($correctCount + $incorrectCount);

        return Inertia::render('student/exams/success', [
            'exam' => [
                'id' => $exam->id,
                'name' => $exam->name,
                'show_result' => $exam->show_result,
            ],
            'attempt' => [
                'id' => $attempt->id,
                'submitted_at' => $attempt->submitted_at?->translatedFormat('d M Y, H:i'),
                'score' => $exam->show_result ? $attempt->score : null,
                'total_questions' => $totalQuestions,
                'correct_count' => $exam->show_result ? $correctCount : null,
                'incorrect_count' => $exam->show_result ? $incorrectCount : null,
                'unanswered_count' => $exam->show_result ? $unansweredCount : null,
            ],
        ]);
    }

    private function finalizeAttempt(ExamAttempt $attempt, Exam $exam): void
    {
        $totalQuestions = $exam->package->questions()->count();
        $correctCount = $attempt->answers()->where('is_correct', true)->count();

        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0.0;

        $attempt->update([
            'status' => 'submitted',
            'submitted_at' => now(),
            'score' => $score,
        ]);
    }
}
