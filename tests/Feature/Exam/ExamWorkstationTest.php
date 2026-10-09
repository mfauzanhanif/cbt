<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuestionPackage;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('student can view active exam workstation, auto-save answer, and submit exam', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $student = User::factory()->create();
    $student->assignRole(Role::Mahasiswa->value);

    $course = Course::create([
        'teacher_id' => $dosen->id,
        'name' => 'Fisika Dasar',
        'code' => 'FD-101',
    ]);
    $course->students()->attach($student->id);

    $question = Question::create([
        'teacher_id' => $dosen->id,
        'text' => 'Berapa gravitasi bumi?',
    ]);
    $optA = QuestionOption::create(['question_id' => $question->id, 'label' => 'A', 'text' => '9.8 m/s2', 'is_correct' => true]);
    $optB = QuestionOption::create(['question_id' => $question->id, 'label' => 'B', 'text' => '15 m/s2', 'is_correct' => false]);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Fisika',
    ]);
    $package->questions()->attach($question->id, ['order' => 1]);

    $exam = Exam::create([
        'teacher_id' => $dosen->id,
        'course_id' => $course->id,
        'package_id' => $package->id,
        'name' => 'Ujian Fisika 1',
        'start_at' => now()->subHour(),
        'end_at' => now()->addHours(2),
        'duration_minutes' => 60,
        'is_active' => true,
        'show_result' => true,
    ]);

    // 1. Student views exams index
    $indexResponse = $this->actingAs($student)->get(route('student.exams.index'));
    $indexResponse->assertOk();

    // 2. Student starts exam
    $startResponse = $this->actingAs($student)->post(route('student.exams.start', $exam));
    $startResponse->assertRedirect(route('student.exams.workstation', $exam));

    $attempt = ExamAttempt::where('exam_id', $exam->id)->where('student_id', $student->id)->first();
    expect($attempt)->not->toBeNull();
    expect($attempt->status)->toBe('in_progress');

    // 3. Student views workstation
    $workstationResponse = $this->actingAs($student)->get(route('student.exams.workstation', $exam));
    $workstationResponse->assertOk();
    $workstationResponse->assertInertia(fn ($page) => $page->component('student/exams/workstation')->has('questions'));

    // 4. Student auto-saves answer
    $saveResponse = $this->actingAs($student)->postJson(route('student.exams.save-answer', $exam), [
        'question_id' => $question->id,
        'selected_option_id' => $optA->id,
        'is_flagged' => false,
    ]);
    $saveResponse->assertOk();
    $saveResponse->assertJson(['status' => 'saved']);

    $this->assertDatabaseHas('exam_answers', [
        'attempt_id' => $attempt->id,
        'question_id' => $question->id,
        'selected_option_id' => $optA->id,
        'is_correct' => true,
    ]);

    // 5. Student submits exam
    $submitResponse = $this->actingAs($student)->post(route('student.exams.submit', $exam));
    $submitResponse->assertRedirect(route('student.exams.success', $exam));

    expect($attempt->fresh()->status)->toBe('submitted');
    expect((float) $attempt->fresh()->score)->toBe(100.0);

    // 6. Student views success page
    $successResponse = $this->actingAs($student)->get(route('student.exams.success', $exam));
    $successResponse->assertOk();
});

test('non-enrolled student cannot take exam', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $student = User::factory()->create();
    $student->assignRole(Role::Mahasiswa->value);

    $course = Course::create(['teacher_id' => $dosen->id, 'name' => 'Biologi', 'code' => 'BIO-101']);
    $package = QuestionPackage::create(['teacher_id' => $dosen->id, 'name' => 'Paket Bio']);
    $exam = Exam::create([
        'teacher_id' => $dosen->id,
        'course_id' => $course->id,
        'package_id' => $package->id,
        'name' => 'Ujian Bio',
        'start_at' => now()->subHour(),
        'end_at' => now()->addHours(2),
        'duration_minutes' => 60,
        'is_active' => true,
    ]);

    $this->actingAs($student)->post(route('student.exams.start', $exam))->assertForbidden();
});
