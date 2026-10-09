<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\QuestionPackage\StoreQuestionPackageRequest;
use App\Models\Question;
use App\Models\QuestionPackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionPackageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->query('search');

        $query = QuestionPackage::query()
            ->with('teacher:id,name,email')
            ->withCount('questions')
            ->when($search, function ($q, $search): void {
                $q->where('name', 'like', "%{$search}%");
            });

        if (! $user->hasRole(Role::Admin->value)) {
            $query->where('teacher_id', $user->id);
        }

        $packages = $query->latest()->paginate(9)->withQueryString();

        return Inertia::render('question-packages/index', [
            'packages' => $packages,
            'filters' => [
                'search' => $search,
            ],
            'canCreate' => $user->can('create', QuestionPackage::class),
        ]);
    }

    public function store(StoreQuestionPackageRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        QuestionPackage::create([
            'teacher_id' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', 'Paket soal berhasil dibuat.');
    }

    public function show(QuestionPackage $package): Response
    {
        Gate::authorize('view', $package);

        $package->load(['teacher:id,name', 'questions' => function ($q): void {
            $q->with('options')->orderByPivot('order');
        }]);

        // Available questions from teacher's bank not yet in this package
        $existingQuestionIds = $package->questions->pluck('id')->all();
        $availableQuestions = Question::where('teacher_id', $package->teacher_id)
            ->whereNotIn('id', $existingQuestionIds)
            ->select('id', 'text', 'difficulty')
            ->latest()
            ->get();

        return Inertia::render('question-packages/show', [
            'package' => $package,
            'availableQuestions' => $availableQuestions,
        ]);
    }

    public function update(StoreQuestionPackageRequest $request, QuestionPackage $package): RedirectResponse
    {
        Gate::authorize('update', $package);

        $package->update($request->validated());

        return back()->with('success', 'Paket soal berhasil diperbarui.');
    }

    public function destroy(QuestionPackage $package): RedirectResponse
    {
        Gate::authorize('delete', $package);

        $package->delete();

        return redirect()->route('question-packages.index')->with('success', 'Paket soal berhasil dihapus.');
    }

    public function syncQuestions(Request $request, QuestionPackage $package): RedirectResponse
    {
        Gate::authorize('update', $package);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'items.*.order' => ['required', 'integer'],
        ]);

        $syncData = [];
        foreach ($validated['items'] as $item) {
            $syncData[$item['question_id']] = ['order' => $item['order']];
        }

        $package->questions()->sync($syncData);

        return back()->with('success', 'Daftar dan urutan butir soal berhasil disimpan.');
    }
}
