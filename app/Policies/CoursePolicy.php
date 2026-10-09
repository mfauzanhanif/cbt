<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Super Admin bypasses all checks.
     */
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

    public function view(User $user, Course $course): bool
    {
        if ($course->teacher_id === $user->id) {
            return true;
        }

        return $course->students()->where('users.id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value]);
    }

    public function update(User $user, Course $course): bool
    {
        return $course->teacher_id === $user->id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $course->teacher_id === $user->id;
    }

    public function manageMembers(User $user, Course $course): bool
    {
        return $course->teacher_id === $user->id;
    }
}
