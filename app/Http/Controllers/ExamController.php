<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\Exam\StoreExamRequest;
use App\Http\Requests\Exam\UpdateExamRequest;
use App\Models\Course;
use App\Models\Exam;
use App\Models\QuestionPackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->query('search');

        $query = Exam::query()
            ->with(['course:id,name,code', 'package:id,name', 'teacher:id,name'])
            ->withCount('attempts')
            ->when($search, function ($q, $search): void {
                $q->where('name', 'like', "%{$search}%");
            });

        if (! $user->hasRole(Role::Admin->value)) {
            $query->where('teacher_id', $user->id);
        }

        $exams = $query->latest('start_at')->paginate(10)->withQueryString();

        // Available courses and packages for creating new exam
        $coursesQuery = Course::query()->select('id', 'name', 'code')->orderBy('name');
        $packagesQuery = QuestionPackage::query()->select('id', 'name')->orderBy('name');

        if (! $user->hasRole(Role::Admin->value)) {
            $coursesQuery->where('teacher_id', $user->id);
            $packagesQuery->where('teacher_id', $user->id);
        }

        return Inertia::render('exams/index', [
            'exams' => $exams,
            'courses' => $coursesQuery->get(),
            'packages' => $packagesQuery->get(),
            'filters' => [
                'search' => $search,
            ],
            'canCreate' => $user->can('create', Exam::class),
        ]);
    }

    public function store(StoreExamRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        Exam::create([
            'teacher_id' => $user->id,
            'course_id' => $validated['course_id'],
            'package_id' => $validated['package_id'],
            'name' => $validated['name'],
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'duration_minutes' => $validated['duration_minutes'],
            'is_active' => $validated['is_active'] ?? true,
            'shuffle_questions' => $validated['shuffle_questions'] ?? false,
            'show_result' => $validated['show_result'] ?? true,
        ]);

        return back()->with('success', 'Jadwal ujian berhasil dibuat.');
    }

    public function update(UpdateExamRequest $request, Exam $exam): RedirectResponse
    {
        $validated = $request->validated();

        $exam->update([
            'course_id' => $validated['course_id'],
            'package_id' => $validated['package_id'],
            'name' => $validated['name'],
            'start_at' => $validated['start_at'],
            'end_at' => $validated['end_at'],
            'duration_minutes' => $validated['duration_minutes'],
            'is_active' => $validated['is_active'] ?? true,
            'shuffle_questions' => $validated['shuffle_questions'] ?? false,
            'show_result' => $validated['show_result'] ?? true,
        ]);

        return back()->with('success', 'Jadwal ujian berhasil diperbarui.');
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        Gate::authorize('delete', $exam);

        $exam->delete();

        return back()->with('success', 'Jadwal ujian berhasil dihapus.');
    }

    public function toggleStatus(Exam $exam): RedirectResponse
    {
        Gate::authorize('update', $exam);

        $exam->update([
            'is_active' => ! $exam->is_active,
        ]);

        $statusText = $exam->is_active ? 'dibuka' : 'ditutup';

        return back()->with('success', "Akses ujian berhasil {$statusText}.");
    }
}
