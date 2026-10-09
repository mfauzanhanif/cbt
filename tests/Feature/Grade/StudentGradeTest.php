<?php

declare(strict_types=1);

namespace Tests\Feature\Grade;

use App\Enums\Role;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuestionPackage;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);

    $this->teacher = User::factory()->create();
    $this->teacher->assignRole(Role::Dosen->value);

    $this->student = User::factory()->create();
    $this->student->assignRole(Role::Mahasiswa->value);

    $this->course = Course::create([
        'teacher_id' => $this->teacher->id,
        'name' => 'Pemrograman Web Lanjut',
        'code' => 'PWL-101',
    ]);
    $this->course->students()->attach($this->student->id);

    $this->package = QuestionPackage::create([
        'teacher_id' => $this->teacher->id,
        'name' => 'Paket Soal UTS',
    ]);

    $this->question = Question::create([
        'teacher_id' => $this->teacher->id,
        'type' => 'single_choice',
        'text' => 'Apa itu Laravel?',
        'explanation' => 'Laravel adalah framework PHP.',
        'difficulty' => 'mudah',
    ]);

    $this->optCorrect = QuestionOption::create([
        'question_id' => $this->question->id,
        'label' => 'A',
        'text' => 'PHP Framework',
        'is_correct' => true,
    ]);

    $this->optWrong = QuestionOption::create([
        'question_id' => $this->question->id,
        'label' => 'B',
        'text' => 'JavaScript Library',
        'is_correct' => false,
    ]);

    $this->package->questions()->attach($this->question->id, ['order' => 1]);

    $this->exam = Exam::create([
        'teacher_id' => $this->teacher->id,
        'course_id' => $this->course->id,
        'package_id' => $this->package->id,
        'name' => 'UTS Web Programming',
        'start_at' => now()->subDay(),
        'end_at' => now()->addDays(2),
        'duration_minutes' => 60,
        'is_active' => true,
        'shuffle_questions' => false,
        'show_result' => true,
    ]);
});

test('student can view their grades history', function (): void {
    $attempt = ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student->id,
        'started_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
        'score' => 100.0,
        'status' => 'submitted',
    ]);

    ExamAnswer::create([
        'attempt_id' => $attempt->id,
        'question_id' => $this->question->id,
        'selected_option_id' => $this->optCorrect->id,
        'is_correct' => true,
        'answered_at' => now()->subHour(),
    ]);

    $response = $this->actingAs($this->student)
        ->get(route('student.grades.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/grades/index')
            ->has('attempts.data', 1)
            ->where('attempts.data.0.exam_name', 'UTS Web Programming')
            ->where('attempts.data.0.score', 100)
            ->where('attempts.data.0.show_result', true)
        );
});

test('score is masked when exam show_result is false', function (): void {
    $this->exam->update(['show_result' => false]);

    ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student->id,
        'started_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
        'score' => 100.0,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($this->student)
        ->get(route('student.grades.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/grades/index')
            ->where('attempts.data.0.score', null)
            ->where('attempts.data.0.show_result', false)
        );
});

test('student can review their submitted answers if show_result is true', function (): void {
    $attempt = ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student->id,
        'started_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
        'score' => 100.0,
        'status' => 'submitted',
    ]);

    ExamAnswer::create([
        'attempt_id' => $attempt->id,
        'question_id' => $this->question->id,
        'selected_option_id' => $this->optCorrect->id,
        'is_correct' => true,
        'answered_at' => now()->subHour(),
    ]);

    $response = $this->actingAs($this->student)
        ->get(route('student.grades.review', $attempt));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/grades/review')
            ->where('scorecard.score', 100)
            ->where('scorecard.correct_count', 1)
            ->has('questions', 1)
        );
});

test('student cannot review answers if show_result is false', function (): void {
    $this->exam->update(['show_result' => false]);

    $attempt = ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student->id,
        'started_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
        'score' => 100.0,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($this->student)
        ->get(route('student.grades.review', $attempt));

    $response->assertForbidden();
});

test('student cannot review another students attempt', function (): void {
    $otherStudent = User::factory()->create();
    $otherStudent->assignRole(Role::Mahasiswa->value);

    $attempt = ExamAttempt::create([
        'exam_id' => $this->exam->id,
        'student_id' => $this->student->id,
        'started_at' => now()->subHours(2),
        'submitted_at' => now()->subHour(),
        'score' => 100.0,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($otherStudent)
        ->get(route('student.grades.review', $attempt));

    $response->assertForbidden();
});
