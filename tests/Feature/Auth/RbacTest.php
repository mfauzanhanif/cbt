<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);

    // Register test routes to verify Spatie role middleware
    Route::middleware(['web', 'auth', 'role:admin'])->get('/test/admin-route', fn (): string => 'admin-ok');
    Route::middleware(['web', 'auth', 'role:dosen'])->get('/test/dosen-route', fn (): string => 'dosen-ok');
    Route::middleware(['web', 'auth', 'role:mahasiswa'])->get('/test/mahasiswa-route', fn (): string => 'mahasiswa-ok');
});

test('spatie roles can be assigned to users and verified via hasRole', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $dosen = User::factory()->create();
    $dosen->assignRole('dosen');

    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    expect($admin->hasRole('admin'))->toBeTrue();
    expect($admin->hasRole('dosen'))->toBeFalse();

    expect($dosen->hasRole('dosen'))->toBeTrue();
    expect($dosen->hasRole('mahasiswa'))->toBeFalse();

    expect($mahasiswa->hasRole('mahasiswa'))->toBeTrue();
    expect($mahasiswa->hasRole('admin'))->toBeFalse();
});

test('admin can access admin route while dosen and mahasiswa receive 403 forbidden', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $dosen = User::factory()->create();
    $dosen->assignRole('dosen');

    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    $this->actingAs($admin)->get('/test/admin-route')->assertOk()->assertSee('admin-ok');
    $this->actingAs($dosen)->get('/test/admin-route')->assertForbidden();
    $this->actingAs($mahasiswa)->get('/test/admin-route')->assertForbidden();
});

test('dosen can access dosen route while mahasiswa receives 403 forbidden', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole('dosen');

    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    $this->actingAs($dosen)->get('/test/dosen-route')->assertOk()->assertSee('dosen-ok');
    $this->actingAs($mahasiswa)->get('/test/dosen-route')->assertForbidden();
});

test('mahasiswa can access mahasiswa route', function (): void {
    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    $this->actingAs($mahasiswa)->get('/test/mahasiswa-route')->assertOk()->assertSee('mahasiswa-ok');
});

test('unauthenticated guest is redirected to login when accessing role protected routes', function (): void {
    $this->get('/test/admin-route')->assertRedirect(route('login'));
    $this->get('/test/dosen-route')->assertRedirect(route('login'));
    $this->get('/test/mahasiswa-route')->assertRedirect(route('login'));
});

test('changing user role updates authorization immediately on subsequent requests', function (): void {
    $user = User::factory()->create();
    $user->assignRole('mahasiswa');

    // Mahasiswa attempting to access dosen route gets 403
    $this->actingAs($user)->get('/test/dosen-route')->assertForbidden();

    // Promote user to dosen
    $user->syncRoles(['dosen']);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Now succeeds
    $this->actingAs($user->fresh())->get('/test/dosen-route')->assertOk();
});
