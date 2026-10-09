<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Exports\ExamGradesExport;
use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExamGradeController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, Exam $exam): Response
    {
        $this->authorize('viewGrades', $exam);

        $exam->load(['course.students', 'teacher', 'package.questions']);

        $search = $request->string('search')->trim()->value();
        $sortBy = $request->input('sort', 'name'); // name, score_desc, score_asc

        $attempts = ExamAttempt::where('exam_id', $exam->id)
            ->with('answers')
            ->get()
            ->keyBy('student_id');

        $students = $exam->course->students;

        if ($search !== '') {
            $students = $students->filter(function (User $s) use ($search): bool {
                return str_contains(strtolower($s->name), strtolower($search))
                    || str_contains(strtolower($s->email), strtolower($search));
            });
        }

        $studentData = $students->map(function (User $student) use ($attempts): array {
            /** @var ExamAttempt|null $attempt */
            $attempt = $attempts->get($student->id);

            $status = 'not_started';
            $submittedAt = null;
            $score = null;
            $attemptId = null;

            if ($attempt !== null) {
                $attemptId = $attempt->id;
                if ($attempt->status === 'submitted' || $attempt->status === 'graded') {
                    $status = 'completed';
                    $submittedAt = $attempt->submitted_at?->format('d M Y, H:i');
                    $score = $attempt->score;
                } elseif ($attempt->status === 'in_progress') {
                    $status = 'in_progress';
                }
            }

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'status' => $status,
                'attempt_id' => $attemptId,
                'submitted_at' => $submittedAt,
                'score' => $score,
            ];
        });

        if ($sortBy === 'score_desc') {
            $studentData = $studentData->sortByDesc(fn (array $s): float => (float) ($s['score'] ?? -1))->values();
        } elseif ($sortBy === 'score_asc') {
            $studentData = $studentData->sortBy(fn (array $s): float => (float) ($s['score'] ?? 999))->values();
        } else {
            $studentData = $studentData->sortBy('name')->values();
        }

        $allAttempts = ExamAttempt::where('exam_id', $exam->id)->get();
        $completedAttempts = $allAttempts->filter(fn (ExamAttempt $a): bool => $a->status === 'submitted' || $a->status === 'graded');
        $completedScores = $completedAttempts->pluck('score')->filter(fn ($s) => $s !== null);

        $stats = [
            'total_enrolled' => $exam->course->students->count(),
            'completed_count' => $completedAttempts->count(),
            'in_progress_count' => $allAttempts->filter(fn (ExamAttempt $a): bool => $a->status === 'in_progress')->count(),
            'not_started_count' => max(0, $exam->course->students->count() - $allAttempts->count()),
            'average_score' => $completedScores->isNotEmpty() ? round((float) $completedScores->avg(), 1) : null,
            'highest_score' => $completedScores->isNotEmpty() ? (float) $completedScores->max() : null,
            'lowest_score' => $completedScores->isNotEmpty() ? (float) $completedScores->min() : null,
        ];

        return Inertia::render('exams/grades', [
            'exam' => [
                'id' => $exam->id,
                'name' => $exam->name,
                'course_id' => $exam->course_id,
                'course_name' => $exam->course->name,
                'course_code' => $exam->course->code,
                'teacher_name' => $exam->teacher->name,
                'start_at' => $exam->start_at->format('d M Y, H:i'),
                'end_at' => $exam->end_at->format('d M Y, H:i'),
                'duration_minutes' => $exam->duration_minutes,
                'total_questions' => $exam->package->questions->count(),
                'show_result' => (bool) $exam->show_result,
            ],
            'students' => $studentData,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'sort' => $sortBy,
            ],
        ]);
    }

    public function review(Exam $exam, ExamAttempt $attempt): Response
    {
        $this->authorize('viewGrades', $exam);

        abort_if($attempt->exam_id !== $exam->id, 404);

        $attempt->load([
            'exam.course',
            'exam.teacher',
            'exam.package.questions.options',
            'student',
            'answers',
        ]);

        $answersByQuestion = $attempt->answers->keyBy('question_id');
        $questions = $attempt->exam->package->questions
            ->sortBy(fn (Question $q) => $q->pivot->order ?? $q->id)
            ->values()
            ->map(function (Question $q, int $index) use ($answersByQuestion): array {
                /** @var ExamAnswer|null $ans */
                $ans = $answersByQuestion->get($q->id);
                $selectedOptionId = $ans?->selected_option_id;
                $isCorrect = $ans?->is_correct;

                return [
                    'number' => $index + 1,
                    'id' => $q->id,
                    'text' => $q->text,
                    'explanation' => $q->explanation,
                    'difficulty' => $q->difficulty,
                    'image_url' => $q->getFirstMediaUrl('image') ?: null,
                    'selected_option_id' => $selectedOptionId,
                    'is_correct' => $isCorrect,
                    'is_unanswered' => $selectedOptionId === null,
                    'options' => $q->options->map(fn (QuestionOption $opt): array => [
                        'id' => $opt->id,
                        'label' => $opt->label,
                        'text' => $opt->text,
                        'is_correct' => (bool) $opt->is_correct,
                        'image_url' => $opt->getFirstMediaUrl('image') ?: null,
                    ])->all(),
                ];
            });

        $totalQuestions = $questions->count();
        $correctCount = $questions->filter(fn (array $q): bool => $q['is_correct'] === true)->count();
        $incorrectCount = $questions->filter(fn (array $q): bool => $q['is_correct'] === false && ! $q['is_unanswered'])->count();
        $unansweredCount = $totalQuestions - ($correctCount + $incorrectCount);

        return Inertia::render('student/grades/review', [
            'attempt' => [
                'id' => $attempt->id,
                'student_name' => $attempt->student->name,
                'student_email' => $attempt->student->email,
                'started_at' => $attempt->started_at->format('d M Y, H:i'),
                'submitted_at' => $attempt->submitted_at?->format('d M Y, H:i'),
                'score' => $attempt->score,
            ],
            'exam' => [
                'id' => $exam->id,
                'name' => $exam->name,
                'course_name' => $exam->course->name,
                'course_code' => $exam->course->code,
                'teacher_name' => $exam->teacher->name,
                'duration_minutes' => $exam->duration_minutes,
                'show_result' => (bool) $exam->show_result,
            ],
            'questions' => $questions,
            'scorecard' => [
                'score' => $attempt->score,
                'total_questions' => $totalQuestions,
                'correct_count' => $correctCount,
                'incorrect_count' => $incorrectCount,
                'unanswered_count' => $unansweredCount,
            ],
            'isTeacherView' => true,
        ]);
    }

    public function export(Exam $exam): BinaryFileResponse
    {
        $this->authorize('exportGrades', $exam);

        $exam->load('course');
        $fileName = 'rekap-nilai-'.Str::slug($exam->name).'-'.date('Ymd').'.xlsx';

        return Excel::download(new ExamGradesExport($exam), $fileName);
    }
}
