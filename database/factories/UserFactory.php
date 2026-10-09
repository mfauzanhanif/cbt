<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this;
    }

    /**
     * Indicate that the user account is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_active' => false,
        ]);
    }

    /**
     * Assign the 'admin' role upon creation.
     */
    public function admin(): static
    {
        return $this->afterCreating(function (User $user): void {
            $user->assignRole('admin');
        });
    }

    /**
     * Assign the 'dosen' role upon creation.
     */
    public function dosen(): static
    {
        return $this->afterCreating(function (User $user): void {
            $user->assignRole('dosen');
        });
    }

    /**
     * Assign the 'mahasiswa' role upon creation.
     */
    public function mahasiswa(): static
    {
        return $this->afterCreating(function (User $user): void {
            $user->assignRole('mahasiswa');
        });
    }
}
