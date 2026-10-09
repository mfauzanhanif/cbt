<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentGradeController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $user = $request->user();

        $attempts = ExamAttempt::where('student_id', $user->id)
            ->whereIn('status', ['submitted', 'graded'])
            ->with(['exam.course', 'exam.teacher', 'exam.package.questions'])
            ->latest('submitted_at')
            ->paginate(10)
            ->through(function (ExamAttempt $attempt): array {
                $showResult = (bool) $attempt->exam->show_result;
                $totalQuestions = $attempt->exam->package->questions->count();
                $correctCount = $attempt->answers()->where('is_correct', true)->count();
                $incorrectCount = $attempt->answers()->where('is_correct', false)->whereNotNull('selected_option_id')->count();
                $unansweredCount = $totalQuestions - ($correctCount + $incorrectCount);

                return [
                    'id' => $attempt->id,
                    'exam_id' => $attempt->exam_id,
                    'exam_name' => $attempt->exam->name,
                    'course_name' => $attempt->exam->course->name,
                    'course_code' => $attempt->exam->course->code,
                    'teacher_name' => $attempt->exam->teacher->name,
                    'submitted_at' => $attempt->submitted_at?->format('d M Y, H:i'),
                    'duration_minutes' => $attempt->exam->duration_minutes,
                    'show_result' => $showResult,
                    'score' => $showResult ? $attempt->score : null,
                    'total_questions' => $totalQuestions,
                    'correct_count' => $showResult ? $correctCount : null,
                    'incorrect_count' => $showResult ? $incorrectCount : null,
                    'unanswered_count' => $showResult ? $unansweredCount : null,
                ];
            });

        $allCompletedAttempts = ExamAttempt::where('student_id', $user->id)
            ->whereIn('status', ['submitted', 'graded'])
            ->with('exam')
            ->get();

        $visibleScores = $allCompletedAttempts
            ->filter(fn (ExamAttempt $a): bool => (bool) $a->exam->show_result && $a->score !== null)
            ->pluck('score');

        $stats = [
            'total_completed' => $allCompletedAttempts->count(),
            'average_score' => $visibleScores->isNotEmpty() ? round((float) $visibleScores->avg(), 1) : null,
            'highest_score' => $visibleScores->isNotEmpty() ? (float) $visibleScores->max() : null,
        ];

        return Inertia::render('student/grades/index', [
            'attempts' => $attempts,
            'stats' => $stats,
        ]);
    }

    public function review(ExamAttempt $attempt): Response
    {
        $this->authorize('review', $attempt);

        $attempt->load([
            'exam.course',
            'exam.teacher',
            'exam.package.questions.options',
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
                'started_at' => $attempt->started_at->format('d M Y, H:i'),
                'submitted_at' => $attempt->submitted_at?->format('d M Y, H:i'),
                'score' => $attempt->score,
            ],
            'exam' => [
                'id' => $attempt->exam->id,
                'name' => $attempt->exam->name,
                'course_name' => $attempt->exam->course->name,
                'course_code' => $attempt->exam->course->code,
                'teacher_name' => $attempt->exam->teacher->name,
                'duration_minutes' => $attempt->exam->duration_minutes,
                'show_result' => (bool) $attempt->exam->show_result,
            ],
            'questions' => $questions,
            'scorecard' => [
                'score' => $attempt->score,
                'total_questions' => $totalQuestions,
                'correct_count' => $correctCount,
                'incorrect_count' => $incorrectCount,
                'unanswered_count' => $unansweredCount,
            ],
            'isTeacherView' => false,
        ]);
    }
}
