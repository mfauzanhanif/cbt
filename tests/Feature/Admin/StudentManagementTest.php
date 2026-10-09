<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('admin can view students list', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $student = User::factory()->create(['name' => 'John Student']);
    $student->assignRole(Role::Mahasiswa->value);

    $response = $this->actingAs($admin)->get(route('admin.students.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/students/index')->has('students.data'));
});

test('admin can create student account', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $response = $this->actingAs($admin)->post(route('admin.students.store'), [
        'name' => 'Budi Pratama',
        'email' => 'budi.pratama@cbt.test',
        'phone' => '081234567899',
        'password' => 'secret1234',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'email' => 'budi.pratama@cbt.test',
        'name' => 'Budi Pratama',
        'is_active' => true,
    ]);

    $newUser = User::where('email', 'budi.pratama@cbt.test')->first();
    expect($newUser->hasRole(Role::Mahasiswa->value))->toBeTrue();
    expect(Hash::check('secret1234', $newUser->password))->toBeTrue();
});

test('admin can update student account', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $student = User::factory()->create(['name' => 'Old Name', 'email' => 'old@cbt.test']);
    $student->assignRole(Role::Mahasiswa->value);

    $response = $this->actingAs($admin)->put(route('admin.students.update', $student), [
        'name' => 'New Name',
        'email' => 'new@cbt.test',
        'phone' => '089999999999',
        'is_active' => false,
    ]);

    $response->assertRedirect();
    expect($student->fresh()->name)->toBe('New Name');
    expect($student->fresh()->email)->toBe('new@cbt.test');
    expect($student->fresh()->is_active)->toBeFalse();
});

test('admin can toggle student active status', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $student = User::factory()->create(['is_active' => true]);
    $student->assignRole(Role::Mahasiswa->value);

    $response = $this->actingAs($admin)->patch(route('admin.students.toggle-status', $student));

    $response->assertRedirect();
    expect($student->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)->patch(route('admin.students.toggle-status', $student));
    expect($student->fresh()->is_active)->toBeTrue();
});

test('non-admin cannot access admin student endpoints', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole(Role::Mahasiswa->value);

    $this->actingAs($dosen)->get(route('admin.students.index'))->assertForbidden();
    $this->actingAs($mahasiswa)->get(route('admin.students.index'))->assertForbidden();
});
