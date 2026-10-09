<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('dosen can create course and is set as teacher', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $response = $this->actingAs($dosen)->post(route('courses.store'), [
        'name' => 'Kecerdasan Buatan',
        'code' => 'AI-101',
        'description' => 'Mata kuliah AI',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('courses', [
        'name' => 'Kecerdasan Buatan',
        'code' => 'AI-101',
        'teacher_id' => $dosen->id,
    ]);
});

test('dosen can add and remove students in their course', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $student = User::factory()->create();
    $student->assignRole(Role::Mahasiswa->value);

    $course = Course::create([
        'teacher_id' => $dosen->id,
        'name' => 'Basis Data',
        'code' => 'BD-101',
    ]);

    // Add student
    $addResponse = $this->actingAs($dosen)->post(route('courses.students.add', $course), [
        'student_ids' => [$student->id],
    ]);
    $addResponse->assertRedirect();
    expect($course->students()->where('users.id', $student->id)->exists())->toBeTrue();

    // Remove student
    $removeResponse = $this->actingAs($dosen)->delete(route('courses.students.remove', [$course, $student]));
    $removeResponse->assertRedirect();
    expect($course->students()->where('users.id', $student->id)->exists())->toBeFalse();
});

test('dosen cannot modify or delete another dosen course', function (): void {
    $dosen1 = User::factory()->create();
    $dosen1->assignRole(Role::Dosen->value);

    $dosen2 = User::factory()->create();
    $dosen2->assignRole(Role::Dosen->value);

    $course = Course::create([
        'teacher_id' => $dosen1->id,
        'name' => 'Jaringan Komputer',
        'code' => 'JK-101',
    ]);

    $this->actingAs($dosen2)->put(route('courses.update', $course), [
        'name' => 'Hacked Name',
        'code' => 'JK-101',
    ])->assertForbidden();

    $this->actingAs($dosen2)->delete(route('courses.destroy', $course))->assertForbidden();
});
