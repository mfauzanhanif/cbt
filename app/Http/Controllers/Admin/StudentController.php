<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Http\Requests\Admin\UpdateStudentRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $students = User::role(Role::Mahasiswa->value)
            ->when($search, function ($query, $search): void {
                $query->where(function ($q) use ($search): void {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', function ($query) use ($status): void {
                $query->where('is_active', $status === 'active' || $status === '1');
            })
            ->withCount('enrolledCourses')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $password = ! empty($validated['password']) ? $validated['password'] : 'password';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($password),
            'is_active' => $validated['is_active'] ?? true,
            'email_verified_at' => now(),
        ]);

        $user->assignRole(Role::Mahasiswa->value);

        return back()->with('success', 'Akun mahasiswa berhasil ditambahkan.');
    }

    public function update(UpdateStudentRequest $request, User $student): RedirectResponse
    {
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $student->update($data);

        return back()->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    public function toggleStatus(User $student): RedirectResponse
    {
        $student->update([
            'is_active' => ! $student->is_active,
        ]);

        $statusText = $student->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Akun mahasiswa berhasil {$statusText}.");
    }
}
