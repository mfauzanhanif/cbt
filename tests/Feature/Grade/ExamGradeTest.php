<?php

declare(strict_types=1);

namespace Tests\Feature\Grade;

use App\Enums\Role;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionPackage;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Maatwebsite\Excel\Facades\Excel;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);

    $this->teacher = User::factory()->create();
    $this->teacher->assignRole(Role::Dosen->value);

    $this->student1 = User::factory()->create(['name' => 'Budi Santoso']);
    $this->student1->assignRole(Role::Mahasiswa->value);

    $this->student2 = User::factory()->create(['name' => 'Citra Lestari']);
    $this->student2->assignRole(Role::Mahasiswa->value);

    $this->course = Course::create([
        'teacher_id' => $this->teacher->id,
        'name' => 'Sistem Basis Data',
        'code' => 'SBD-202',
    ]);
    $this->course->students()->attach([$this->student1->id, $this->student2->id]);

    $this->package = QuestionPackage::create([
        'teacher_id' => $this->teacher->id,
        'name' => 'Paket Soal SBD',
    ]);

    $this->question = Question::create([
        'teacher_id' => $this->teacher->id,
        'type' => 'single_choice',
        'text' => 'Apa fungsi SELECT pada SQL?',
        'explanation' => 'SELECT digunakan untuk query data.',
        'difficulty' => 'mudah',
    ]);

    $this->package->questions()->attach($this->question->id, ['order' => 1]);

    $this->exam = Exam::create([
        'teacher_id' => $this->teacher->id,
        'course_id' => $this->course->id,
        'package_id' => $this->package->id,
        'name' => 'UAS Sistem Basis Data',
        'start_at' => now()->subDay(),
        'end_at' => now()->addDays(2),
        'duration_minutes' => 90,
        'is_active' => true,
        'shuffle_questions' => false,
        'show_result' => false,
    ]);
});

test('teacher can view exam grades recap and metrics', function (): void {
    ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student1->id,
        'started_at' => now()->subHour(),
        'submitted_at' => now()->subMinutes(30),
        'score' => 85.0,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($this->teacher)
        ->get(route('exams.grades.index', $this->exam));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('exams/grades')
            ->where('exam.name', 'UAS Sistem Basis Data')
            ->where('stats.total_enrolled', 2)
            ->where('stats.completed_count', 1)
            ->where('stats.average_score', 85)
            ->has('students', 2)
        );
});

test('teacher can review student attempt even when show_result is false', function (): void {
    $attempt = ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student1->id,
        'started_at' => now()->subHour(),
        'submitted_at' => now()->subMinutes(30),
        'score' => 85.0,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($this->teacher)
        ->get(route('exams.grades.review', [$this->exam, $attempt]));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/grades/review')
            ->where('isTeacherView', true)
            ->where('attempt.score', 85)
        );
});

test('another teacher cannot view grades of other teachers exam', function (): void {
    $anotherTeacher = User::factory()->create();
    $anotherTeacher->assignRole(Role::Dosen->value);

    $response = $this->actingAs($anotherTeacher)
        ->get(route('exams.grades.index', $this->exam));

    $response->assertForbidden();
});

test('student cannot access teacher grades recap', function (): void {
    $response = $this->actingAs($this->student1)
        ->get(route('exams.grades.index', $this->exam));

    $response->assertForbidden();
});

test('teacher can export exam grades to excel', function (): void {
    Excel::fake();

    $response = $this->actingAs($this->teacher)
        ->get(route('exams.grades.export', $this->exam));

    $response->assertOk();
    Excel::assertDownloaded('rekap-nilai-uas-sistem-basis-data-'.date('Ymd').'.xlsx');
});
