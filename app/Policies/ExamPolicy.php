<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\Exam;
use App\Models\User;

class ExamPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole(Role::Admin->value)) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value, Role::Mahasiswa->value]);
    }

    public function view(User $user, Exam $exam): bool
    {
        if ($exam->teacher_id === $user->id) {
            return true;
        }

        // Mahasiswa must be enrolled in the course and the exam must be accessible
        return $exam->course->students()->where('users.id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value]);
    }

    public function update(User $user, Exam $exam): bool
    {
        return $exam->teacher_id === $user->id;
    }

    public function delete(User $user, Exam $exam): bool
    {
        return $exam->teacher_id === $user->id;
    }

    public function takeExam(User $user, Exam $exam): bool
    {
        if (! $user->hasRole(Role::Mahasiswa->value)) {
            return false;
        }

        if (! $exam->is_active) {
            return false;
        }

        $now = now();
        if ($now->lt($exam->start_at) || $now->gt($exam->end_at)) {
            return false;
        }

        return $exam->course->students()->where('users.id', $user->id)->exists();
    }

    public function viewGrades(User $user, Exam $exam): bool
    {
        return $exam->teacher_id === $user->id;
    }

    public function exportGrades(User $user, Exam $exam): bool
    {
        return $exam->teacher_id === $user->id;
    }
}
