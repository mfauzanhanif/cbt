<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\QuestionPackage;
use App\Models\User;

class QuestionPackagePolicy
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

    public function view(User $user, QuestionPackage $package): bool
    {
        return $package->teacher_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole([Role::Admin->value, Role::Dosen->value]);
    }

    public function update(User $user, QuestionPackage $package): bool
    {
        return $package->teacher_id === $user->id;
    }

    public function delete(User $user, QuestionPackage $package): bool
    {
        return $package->teacher_id === $user->id;
    }
}
