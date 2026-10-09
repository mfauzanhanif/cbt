<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\Question;
use App\Models\QuestionPackage;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('dosen can create question with multiple options', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $response = $this->actingAs($dosen)->post(route('questions.store'), [
        'text' => 'Apa ibukota Indonesia?',
        'difficulty' => 'mudah',
        'explanation' => 'IKN Nusantara',
        'options' => [
            ['label' => 'A', 'text' => 'Jakarta', 'is_correct' => false],
            ['label' => 'B', 'text' => 'Nusantara', 'is_correct' => true],
            ['label' => 'C', 'text' => 'Bandung', 'is_correct' => false],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('questions', [
        'text' => 'Apa ibukota Indonesia?',
        'teacher_id' => $dosen->id,
    ]);

    $question = Question::where('text', 'Apa ibukota Indonesia?')->first();
    expect($question->options()->count())->toBe(3);
    expect($question->options()->where('is_correct', true)->first()->label)->toBe('B');
});

test('dosen can duplicate question', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $question = Question::create([
        'teacher_id' => $dosen->id,
        'text' => 'Pertanyaan Asli',
        'difficulty' => 'sedang',
    ]);
    $question->options()->create(['label' => 'A', 'text' => 'Jawaban A', 'is_correct' => true]);

    $response = $this->actingAs($dosen)->post(route('questions.duplicate', $question));

    $response->assertRedirect();
    $this->assertDatabaseHas('questions', [
        'text' => 'Pertanyaan Asli (Salinan)',
        'teacher_id' => $dosen->id,
    ]);
});

test('dosen can create package and sync questions', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $q1 = Question::create(['teacher_id' => $dosen->id, 'text' => 'Soal 1']);
    $q2 = Question::create(['teacher_id' => $dosen->id, 'text' => 'Soal 2']);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Tryout',
    ]);

    $response = $this->actingAs($dosen)->post(route('question-packages.sync-questions', $package), [
        'items' => [
            ['question_id' => $q1->id, 'order' => 1],
            ['question_id' => $q2->id, 'order' => 2],
        ],
    ]);

    $response->assertRedirect();
    expect($package->questions()->count())->toBe(2);
});
