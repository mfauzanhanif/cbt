<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Laravel\Fortify\Features;

beforeEach(function (): void {
    $this->skipUnlessFortifyHas(Features::registration());
    $this->seed(RoleSeeder::class);
});

test('registration screen can be rendered', function (): void {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new user registration creates active user with default role mahasiswa', function (): void {
    $response = $this->post(route('register'), [
        'name' => 'Calon Mahasiswa CBT',
        'email' => 'calon.mahasiswa@cbt.test',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'calon.mahasiswa@cbt.test')->first();
    expect($user)->not->toBeNull();
    expect($user->is_active)->toBeTrue();
    expect($user->hasRole('mahasiswa'))->toBeTrue();
});

test('registration fails when email already exists', function (): void {
    User::factory()->create([
        'email' => 'existing@cbt.test',
    ]);

    $response = $this->from(route('register'))->post(route('register'), [
        'name' => 'Duplicate Email User',
        'email' => 'existing@cbt.test',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $response->assertRedirect(route('register'));
});

test('registration fails when password confirmation does not match', function (): void {
    $response = $this->from(route('register'))->post(route('register'), [
        'name' => 'Mismatch Password User',
        'email' => 'mismatch@cbt.test',
        'password' => 'password123',
        'password_confirmation' => 'differentpassword',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('password');
    $response->assertRedirect(route('register'));
});

test('registration fails when password is shorter than 8 characters', function (): void {
    $response = $this->from(route('register'))->post(route('register'), [
        'name' => 'Short Password User',
        'email' => 'short@cbt.test',
        'password' => '1234',
        'password_confirmation' => '1234',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('password');
    $response->assertRedirect(route('register'));
});
