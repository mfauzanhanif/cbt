<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('login screen can be rendered', function (): void {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('active user can authenticate using valid credentials', function (): void {
    $user = User::factory()->create([
        'email' => 'active.user@cbt.test',
        'is_active' => true,
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('inactive user is rejected from login with indonesian validation message via session', function (): void {
    $user = User::factory()->inactive()->create([
        'email' => 'inactive.user@cbt.test',
    ]);

    $response = $this->from(route('login'))->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $response->assertRedirect(route('login'));
});

test('inactive user is rejected from login with 422 unprocessable content via json request', function (): void {
    $user = User::factory()->inactive()->create([
        'email' => 'inactive.json@cbt.test',
    ]);

    $response = $this->postJson(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
});

test('user cannot authenticate with wrong password', function (): void {
    $user = User::factory()->create([
        'email' => 'user@cbt.test',
    ]);

    $response = $this->from(route('login'))->post(route('login'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $response->assertRedirect(route('login'));
});

test('user cannot authenticate with non-existent email', function (): void {
    $response = $this->from(route('login'))->post(route('login'), [
        'email' => 'notfound@cbt.test',
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('authenticated user can logout and session is cleared', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});
