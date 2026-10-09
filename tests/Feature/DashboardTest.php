<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('guests are redirected to the login page', function (): void {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('admin can visit dashboard and see admin stats', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.totalStudents')
            ->has('stats.totalTeachers')
            ->has('stats.totalCourses')
            ->has('stats.totalExams')
        );
});

test('dosen can visit dashboard and see teacher stats', function (): void {
    $teacher = User::factory()->dosen()->create();

    $this->actingAs($teacher)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.taughtCourses')
            ->has('stats.totalQuestions')
            ->has('stats.totalPackages')
            ->has('stats.activeExams')
        );
});

test('mahasiswa can visit dashboard and see student stats', function (): void {
    $student = User::factory()->mahasiswa()->create();

    $this->actingAs($student)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.enrolledCourses')
            ->has('stats.availableExams')
        );
});
