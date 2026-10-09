<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\ExamAttempt;
use App\Models\User;

class ExamAttemptPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole(Role::Admin->value)) {
            return true;
        }

        return null;
    }

    public function view(User $user, ExamAttempt $attempt): bool
    {
        if ($attempt->student_id === $user->id) {
            return true;
        }

        return $attempt->exam->teacher_id === $user->id;
    }

    public function updateAnswer(User $user, ExamAttempt $attempt): bool
    {
        if ($attempt->student_id !== $user->id) {
            return false;
        }

        return $attempt->status === 'in_progress';
    }

    public function submit(User $user, ExamAttempt $attempt): bool
    {
        if ($attempt->student_id !== $user->id) {
            return false;
        }

        return $attempt->status === 'in_progress';
    }

    public function review(User $user, ExamAttempt $attempt): bool
    {
        if ($attempt->student_id === $user->id) {
            return (bool) $attempt->exam->show_result;
        }

        return $attempt->exam->teacher_id === $user->id;
    }
}
