<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\SyncCourseStudentsRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->query('search');

        $query = Course::query()
            ->with('teacher:id,name,email')
            ->withCount('students')
            ->when($search, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            });

        if ($user->hasRole(Role::Dosen->value)) {
            $query->where('teacher_id', $user->id);
        } elseif ($user->hasRole(Role::Mahasiswa->value)) {
            $query->whereHas('students', function ($q) use ($user): void {
                $q->where('users.id', $user->id);
            });
        }

        $courses = $query->orderBy('name')->paginate(9)->withQueryString();

        $teachers = $user->hasRole(Role::Admin->value)
            ? User::role(Role::Dosen->value)->where('is_active', true)->select('id', 'name')->orderBy('name')->get()
            : [];

        return Inertia::render('courses/index', [
            'courses' => $courses,
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
            ],
            'canCreate' => $user->can('create', Course::class),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $teacherId = $user->hasRole(Role::Admin->value) && ! empty($validated['teacher_id'])
            ? (int) $validated['teacher_id']
            : $user->id;

        Course::create([
            'teacher_id' => $teacherId,
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function show(Course $course): Response
    {
        Gate::authorize('view', $course);

        $course->load(['teacher:id,name,email']);
        $students = $course->students()->select('users.id', 'users.name', 'users.email', 'users.phone', 'users.is_active')
            ->orderBy('name')
            ->paginate(15);

        // List students available to be enrolled into this course
        $availableStudents = User::role(Role::Mahasiswa->value)
            ->where('is_active', true)
            ->whereDoesntHave('enrolledCourses', function ($q) use ($course): void {
                $q->where('courses.id', $course->id);
            })
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('courses/show', [
            'course' => $course,
            'students' => $students,
            'availableStudents' => $availableStudents,
            'canManageMembers' => request()->user()?->can('manageMembers', $course) ?? false,
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $data = [
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'description' => $validated['description'] ?? null,
        ];

        if ($user->hasRole(Role::Admin->value) && ! empty($validated['teacher_id'])) {
            $data['teacher_id'] = (int) $validated['teacher_id'];
        }

        $course->update($data);

        return back()->with('success', 'Data kelas berhasil diperbarui.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        Gate::authorize('delete', $course);

        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Kelas berhasil dihapus.');
    }

    public function addStudents(SyncCourseStudentsRequest $request, Course $course): RedirectResponse
    {
        $validated = $request->validated();

        $course->students()->syncWithoutDetaching($validated['student_ids']);

        return back()->with('success', 'Mahasiswa berhasil ditambahkan ke dalam kelas.');
    }

    public function removeStudent(Course $course, User $student): RedirectResponse
    {
        Gate::authorize('manageMembers', $course);

        $course->students()->detach($student->id);

        return back()->with('success', 'Mahasiswa berhasil dikeluarkan dari kelas.');
    }
}
