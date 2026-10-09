<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('admin can view teachers list', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $teacher = User::factory()->create(['name' => 'Prof. Dosen']);
    $teacher->assignRole(Role::Dosen->value);

    $response = $this->actingAs($admin)->get(route('admin.teachers.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/teachers/index')->has('teachers.data'));
});

test('admin can create teacher account', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $response = $this->actingAs($admin)->post(route('admin.teachers.store'), [
        'name' => 'Dr. Bambang Sutrisno',
        'email' => 'bambang.sutrisno@cbt.test',
        'phone' => '081298765432',
        'password' => 'dosenpass123',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'email' => 'bambang.sutrisno@cbt.test',
        'name' => 'Dr. Bambang Sutrisno',
        'is_active' => true,
    ]);

    $newUser = User::where('email', 'bambang.sutrisno@cbt.test')->first();
    expect($newUser->hasRole(Role::Dosen->value))->toBeTrue();
    expect(Hash::check('dosenpass123', $newUser->password))->toBeTrue();
});

test('admin can update teacher account', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $teacher = User::factory()->create(['name' => 'Dr. Lama', 'email' => 'lama@cbt.test']);
    $teacher->assignRole(Role::Dosen->value);

    $response = $this->actingAs($admin)->put(route('admin.teachers.update', $teacher), [
        'name' => 'Dr. Baru',
        'email' => 'baru@cbt.test',
        'phone' => '081111111111',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    expect($teacher->fresh()->name)->toBe('Dr. Baru');
    expect($teacher->fresh()->email)->toBe('baru@cbt.test');
});

test('non-admin cannot access admin teacher endpoints', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $this->actingAs($dosen)->get(route('admin.teachers.index'))->assertForbidden();
});
