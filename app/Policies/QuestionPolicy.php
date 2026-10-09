<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\Question;
use App\Models\User;

class QuestionPolicy
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
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value]);
    }

    public function view(User $user, Question $question): bool
    {
        return $question->teacher_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value]);
    }

    public function update(User $user, Question $question): bool
    {
        return $question->teacher_id === $user->id;
    }

    public function delete(User $user, Question $question): bool
    {
        return $question->teacher_id === $user->id;
    }

    public function duplicate(User $user, Question $question): bool
    {
        return $question->teacher_id === $user->id;
    }
}
