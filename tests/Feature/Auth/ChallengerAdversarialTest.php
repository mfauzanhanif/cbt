<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);

    // Register test routes with strict role guards
    Route::middleware(['web', 'auth', 'role:admin'])->get('/test-adversarial/admin-only', fn (): string => 'admin-secret');
    Route::middleware(['web', 'auth', 'role:dosen'])->get('/test-adversarial/dosen-only', fn (): string => 'dosen-secret');
    Route::middleware(['web', 'auth', 'role:mahasiswa'])->get('/test-adversarial/mahasiswa-only', fn (): string => 'mahasiswa-secret');
});

test('adversarial: inactive user with correct password receives 422 with exact indonesian message on web form', function (): void {
    $inactive = User::factory()->inactive()->create([
        'email' => 'adversarial_inactive_web@cbt.test',
        'password' => 'secret123',
    ]);

    $response = $this->from(route('login'))->post(route('login'), [
        'email' => 'adversarial_inactive_web@cbt.test',
        'password' => 'secret123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $response->assertRedirect(route('login'));
});

test('adversarial: inactive user with correct password receives 422 with exact indonesian message on json request', function (): void {
    $inactive = User::factory()->inactive()->create([
        'email' => 'adversarial_inactive_json@cbt.test',
        'password' => 'secret123',
    ]);

    $response = $this->postJson(route('login'), [
        'email' => 'adversarial_inactive_json@cbt.test',
        'password' => 'secret123',
    ]);

    $this->assertGuest();
    $response->assertStatus(422);
    $response->assertJsonValidationErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
});

test('adversarial: anti-enumeration invariant — inactive user with WRONG password does not leak inactive status', function (): void {
    $inactive = User::factory()->inactive()->create([
        'email' => 'adversarial_anti_leak@cbt.test',
        'password' => 'correct-password',
    ]);

    // Send invalid password for inactive user
    $response = $this->from(route('login'))->post(route('login'), [
        'email' => 'adversarial_anti_leak@cbt.test',
        'password' => 'wrong-attacker-guess',
    ]);

    $this->assertGuest();
    // Must NOT contain inactive message
    $response->assertSessionDoesntHaveErrors(['email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.']);
    $response->assertSessionHasErrors('email');
});

test('adversarial: anti-enumeration invariant on json — inactive user with WRONG password has same response structure as non-existent user', function (): void {
    $inactive = User::factory()->inactive()->create([
        'email' => 'adversarial_anti_leak_json@cbt.test',
        'password' => 'correct-password',
    ]);

    $inactiveWrongPasswordResponse = $this->postJson(route('login'), [
        'email' => 'adversarial_anti_leak_json@cbt.test',
        'password' => 'wrong-password',
    ]);

    $nonExistentResponse = $this->postJson(route('login'), [
        'email' => 'completely_nonexistent_user@cbt.test',
        'password' => 'some-password',
    ]);

    $inactiveWrongPasswordResponse->assertStatus(422);
    $nonExistentResponse->assertStatus(422);

    // Both must return standard credential error and neither should mention inactivity
    expect($inactiveWrongPasswordResponse->json('errors.email.0'))
        ->toBe($nonExistentResponse->json('errors.email.0'))
        ->and($inactiveWrongPasswordResponse->json('errors.email.0'))
        ->not->toContain('dinonaktifkan');
});

test('adversarial: mid-session deactivation immediately ejects user on web request', function (): void {
    $user = User::factory()->create(['is_active' => true]);

    $this->actingAs($user);
    $this->get(route('dashboard'))->assertOk();

    // Admin deactivates user in database
    $user->update(['is_active' => false]);

    // Subsequent request must be intercepted by EnsureUserIsActive middleware
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $this->assertGuest();
});

test('adversarial: mid-session deactivation immediately returns 403 on json request', function (): void {
    $user = User::factory()->create(['is_active' => true]);

    $this->actingAs($user);
    $this->getJson(route('dashboard'))->assertOk();

    // Admin deactivates user in database
    $user->update(['is_active' => false]);

    // Subsequent JSON request must return 403 with Indonesian message
    $response = $this->getJson(route('dashboard'));

    $response->assertStatus(403);
    $response->assertJson([
        'message' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
    ]);
    $this->assertGuest();
});

test('adversarial: RBAC mahasiswa is forbidden (403) from accessing admin and dosen routes', function (): void {
    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    $this->actingAs($mahasiswa)->get('/test-adversarial/admin-only')->assertForbidden();
    $this->actingAs($mahasiswa)->get('/test-adversarial/dosen-only')->assertForbidden();
    $this->actingAs($mahasiswa)->get('/test-adversarial/mahasiswa-only')->assertOk();
});

test('adversarial: RBAC dosen is forbidden (403) from accessing admin routes', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole('dosen');

    $this->actingAs($dosen)->get('/test-adversarial/admin-only')->assertForbidden();
    $this->actingAs($dosen)->get('/test-adversarial/dosen-only')->assertOk();
    $this->actingAs($dosen)->get('/test-adversarial/mahasiswa-only')->assertForbidden();
});

test('adversarial: dynamic mid-session role downgrade immediately revokes access', function (): void {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)->get('/test-adversarial/admin-only')->assertOk();

    // Revoke admin role and assign mahasiswa
    $user->syncRoles(['mahasiswa']);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Subsequent request to admin route is now forbidden
    $this->actingAs($user->fresh())->get('/test-adversarial/admin-only')->assertForbidden();
});

test('adversarial: consecutive 5 failed login attempts trigger 429 lockout response', function (): void {
    $user = User::factory()->create([
        'email' => 'adversarial_lockout@cbt.test',
        'password' => 'correct-pass',
    ]);

    // Send 5 failed login attempts
    for ($i = 0; $i < 5; $i++) {
        $res = $this->postJson(route('login'), [
            'email' => 'adversarial_lockout@cbt.test',
            'password' => 'wrong-pass-'.$i,
        ]);
        $res->assertStatus(422);
    }

    // 6th attempt must be locked out with HTTP 429 Too Many Requests
    $lockoutResponse = $this->postJson(route('login'), [
        'email' => 'adversarial_lockout@cbt.test',
        'password' => 'wrong-pass-6',
    ]);

    $lockoutResponse->assertStatus(429);
});
