<?php

declare(strict_types=1);

namespace Tests\Feature\Question;

use App\Enums\Role;
use App\Models\Question;
use App\Models\QuestionPackage;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('dosen can view question packages index', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Saya',
    ]);

    $response = $this->actingAs($dosen)->get(route('question-packages.index'));

    $response->assertOk();
});

test('dosen can create new question package', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $response = $this->actingAs($dosen)->post(route('question-packages.store'), [
        'name' => 'Paket Semester Genap',
        'description' => 'Paket soal evaluasi',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('question_packages', [
        'name' => 'Paket Semester Genap',
        'teacher_id' => $dosen->id,
    ]);
});

test('dosen can view own question package detail', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Soal Aljabar',
    ]);

    $response = $this->actingAs($dosen)->get(route('question-packages.show', $package));

    $response->assertOk();
});

test('dosen can update own question package', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Nama Awal',
        'description' => 'Deskripsi Awal',
    ]);

    $response = $this->actingAs($dosen)->put(route('question-packages.update', $package), [
        'name' => 'Nama Baru',
        'description' => 'Deskripsi Baru',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('question_packages', [
        'id' => $package->id,
        'name' => 'Nama Baru',
        'description' => 'Deskripsi Baru',
    ]);
});

test('dosen can delete own question package', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Akan Dihapus',
    ]);

    $response = $this->actingAs($dosen)->delete(route('question-packages.destroy', $package));

    $response->assertRedirect(route('question-packages.index'));
    $this->assertDatabaseMissing('question_packages', [
        'id' => $package->id,
    ]);
});

test('dosen can sync and reorder questions in own package', function (): void {
    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $q1 = Question::create(['teacher_id' => $dosen->id, 'text' => 'Soal 1']);
    $q2 = Question::create(['teacher_id' => $dosen->id, 'text' => 'Soal 2']);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Sync',
    ]);

    $response = $this->actingAs($dosen)->post(route('question-packages.sync-questions', $package), [
        'items' => [
            ['question_id' => $q2->id, 'order' => 1],
            ['question_id' => $q1->id, 'order' => 2],
        ],
    ]);

    $response->assertRedirect();
    expect($package->questions()->count())->toBe(2);
    expect($package->questions()->first()->id)->toBe($q2->id);

    // Test clearing all questions (empty items)
    $clearResponse = $this->actingAs($dosen)->post(route('question-packages.sync-questions', $package), [
        'items' => [],
    ]);

    $clearResponse->assertRedirect();
    expect($package->questions()->count())->toBe(0);
});

test('dosen cannot view, update, or delete another dosen package', function (): void {
    $dosen1 = User::factory()->create();
    $dosen1->assignRole(Role::Dosen->value);

    $dosen2 = User::factory()->create();
    $dosen2->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen1->id,
        'name' => 'Paket Milik Dosen 1',
    ]);

    // View forbidden
    $this->actingAs($dosen2)->get(route('question-packages.show', $package))->assertForbidden();

    // Update forbidden
    $this->actingAs($dosen2)->put(route('question-packages.update', $package), [
        'name' => 'Hacked Name',
    ])->assertForbidden();

    // Delete forbidden
    $this->actingAs($dosen2)->delete(route('question-packages.destroy', $package))->assertForbidden();

    // Sync forbidden
    $this->actingAs($dosen2)->post(route('question-packages.sync-questions', $package), [
        'items' => [],
    ])->assertForbidden();
});

test('mahasiswa is forbidden from accessing question packages routes', function (): void {
    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole(Role::Mahasiswa->value);

    $this->actingAs($mahasiswa)->get(route('question-packages.index'))->assertForbidden();
    $this->actingAs($mahasiswa)->post(route('question-packages.store'), [
        'name' => 'Paket Ilegal',
    ])->assertForbidden();
});

test('admin can view and delete any question package', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $dosen = User::factory()->create();
    $dosen->assignRole(Role::Dosen->value);

    $package = QuestionPackage::create([
        'teacher_id' => $dosen->id,
        'name' => 'Paket Dosen untuk Admin',
    ]);

    $this->actingAs($admin)->get(route('question-packages.show', $package))->assertOk();

    $this->actingAs($admin)->delete(route('question-packages.destroy', $package))->assertRedirect(route('question-packages.index'));
    $this->assertDatabaseMissing('question_packages', ['id' => $package->id]);
});
