<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('inactive users cannot authenticate via login screen', function (): void {
    $user = User::factory()->inactive()->create([
        'email' => 'inactive@cbt.test',
        'password' => 'password',
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $this->assertGuest();
});

test('active users can authenticate successfully', function (): void {
    $user = User::factory()->create([
        'email' => 'active@cbt.test',
        'password' => 'password',
        'is_active' => true,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('deactivated user session is automatically invalidated by middleware', function (): void {
    $user = User::factory()->create([
        'is_active' => true,
    ]);

    $this->actingAs($user);
    $this->get(route('dashboard'))->assertOk();

    // Deactivate user in database
    $user->update(['is_active' => false]);

    // Next request should be intercepted, logged out, and redirected to login
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $this->assertGuest();
});

test('deactivated user json request returns 403 forbidden', function (): void {
    $user = User::factory()->create([
        'is_active' => true,
    ]);

    $this->actingAs($user);

    // Deactivate user in database
    $user->update(['is_active' => false]);

    $response = $this->getJson(route('dashboard'));

    $response->assertStatus(403);
    $response->assertJson([
        'message' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $this->assertGuest();
});

test('Inertia shares user roles and flash data correctly', function (): void {
    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole(Role::Dosen->value);

    $this->actingAs($user);

    $this->withSession(['success' => 'Operasi berhasil!'])
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.id', $user->id)
            ->where('auth.user.is_active', true)
            ->where('auth.user.roles', ['dosen'])
            ->where('flash.success', 'Operasi berhasil!')
        );
});
