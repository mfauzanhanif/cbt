<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Question::class);

        $user = $request->user();
        $search = $request->query('search');
        $difficulty = $request->query('difficulty');

        $query = Question::query()
            ->with(['options', 'media'])
            ->withCount('packages')
            ->when($search, function ($q, $search): void {
                $q->where('text', 'like', "%{$search}%");
            })
            ->when($difficulty, function ($q, $difficulty): void {
                $q->where('difficulty', $difficulty);
            });

        if (! $user->hasRole(Role::Admin->value)) {
            $query->where('teacher_id', $user->id);
        }

        $questions = $query->latest()->paginate(10)->through(function (Question $q): array {
            return [
                'id' => $q->id,
                'teacher_id' => $q->teacher_id,
                'type' => $q->type,
                'text' => $q->text,
                'explanation' => $q->explanation,
                'difficulty' => $q->difficulty,
                'image_url' => $q->getFirstMediaUrl('image') ?: null,
                'packages_count' => $q->packages_count,
                'created_at' => $q->created_at?->format('d M Y'),
                'options' => $q->options->map(fn (QuestionOption $opt): array => [
                    'id' => $opt->id,
                    'label' => $opt->label,
                    'text' => $opt->text,
                    'is_correct' => $opt->is_correct,
                    'image_url' => $opt->getFirstMediaUrl('image') ?: null,
                ])->values()->all(),
            ];
        })->withQueryString();

        return Inertia::render('questions/index', [
            'questions' => $questions,
            'filters' => [
                'search' => $search,
                'difficulty' => $difficulty,
            ],
        ]);
    }

    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        DB::transaction(function () use ($validated, $user, $request): void {
            $question = Question::create([
                'teacher_id' => $user->id,
                'type' => 'single_choice',
                'text' => $validated['text'],
                'explanation' => $validated['explanation'] ?? null,
                'difficulty' => $validated['difficulty'] ?? 'sedang',
            ]);

            if ($request->hasFile('image')) {
                $question->addMediaFromRequest('image')->toMediaCollection('image');
            }

            foreach ($validated['options'] as $optionData) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'label' => strtoupper($optionData['label']),
                    'text' => $optionData['text'],
                    'is_correct' => ! empty($optionData['is_correct']),
                ]);
            }
        });

        return back()->with('success', 'Butir soal berhasil ditambahkan.');
    }

    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $question, $request): void {
            $question->update([
                'text' => $validated['text'],
                'explanation' => $validated['explanation'] ?? null,
                'difficulty' => $validated['difficulty'] ?? 'sedang',
            ]);

            if (! empty($validated['remove_image'])) {
                $question->clearMediaCollection('image');
            } elseif ($request->hasFile('image')) {
                $question->clearMediaCollection('image');
                $question->addMediaFromRequest('image')->toMediaCollection('image');
            }

            // Sync options: delete old, create new to preserve clean state
            $question->options()->delete();
            foreach ($validated['options'] as $optionData) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'label' => strtoupper($optionData['label']),
                    'text' => $optionData['text'],
                    'is_correct' => ! empty($optionData['is_correct']),
                ]);
            }
        });

        return back()->with('success', 'Soal berhasil diperbarui.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        Gate::authorize('delete', $question);

        $question->options()->delete();
        $question->clearMediaCollection('image');
        $question->delete();

        return back()->with('success', 'Soal berhasil dihapus.');
    }

    public function duplicate(Question $question): RedirectResponse
    {
        Gate::authorize('duplicate', $question);

        DB::transaction(function () use ($question): void {
            $newQuestion = Question::create([
                'teacher_id' => $question->teacher_id,
                'type' => $question->type,
                'text' => $question->text.' (Salinan)',
                'explanation' => $question->explanation,
                'difficulty' => $question->difficulty,
            ]);

            // Duplicate media if exists
            $media = $question->getFirstMedia('image');
            if ($media) {
                $media->copy($newQuestion, 'image');
            }

            // Duplicate options
            foreach ($question->options as $option) {
                QuestionOption::create([
                    'question_id' => $newQuestion->id,
                    'label' => $option->label,
                    'text' => $option->text,
                    'is_correct' => $option->is_correct,
                ]);
            }
        });

        return back()->with('success', 'Soal berhasil diduplikasi.');
    }
}
