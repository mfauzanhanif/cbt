<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\UploadedFile;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

test('admin can download csv import template', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $response = $this->actingAs($admin)->get(route('admin.import.template'));

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

test('admin can import users from csv file', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    $csvContent = "nama,email,peran,telepon\n"
        ."Rudi Mahasiswa,rudi.mhs@cbt.test,mahasiswa,081234567891\n"
        ."Prof. Haryanto,haryanto@cbt.test,dosen,081298765431\n";

    $file = UploadedFile::fake()->createWithContent('users.csv', $csvContent);

    $response = $this->actingAs($admin)->post(route('admin.import.store'), [
        'file' => $file,
    ]);

    $response->assertRedirect(route('admin.import.index'));

    $this->assertDatabaseHas('users', ['email' => 'rudi.mhs@cbt.test']);
    $this->assertDatabaseHas('users', ['email' => 'haryanto@cbt.test']);

    $rudi = User::where('email', 'rudi.mhs@cbt.test')->first();
    $haryanto = User::where('email', 'haryanto@cbt.test')->first();

    expect($rudi->hasRole(Role::Mahasiswa->value))->toBeTrue();
    expect($haryanto->hasRole(Role::Dosen->value))->toBeTrue();
});
