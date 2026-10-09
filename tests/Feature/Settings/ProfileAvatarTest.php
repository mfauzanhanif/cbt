<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('user can update phone number in profile', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Fauzan Updated',
            'email' => $user->email,
            'phone' => '081234567890',
        ]);

    $response->assertRedirect(route('profile.edit'));
    $user->refresh();

    expect($user->name)->toBe('Fauzan Updated')
        ->and($user->phone)->toBe('081234567890');
});

test('user can upload avatar image', function (): void {
    Storage::fake('public');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
        ]);

    $response->assertRedirect(route('profile.edit'));
    $user->refresh();

    expect($user->getFirstMedia('avatar'))->not->toBeNull()
        ->and($user->avatar_url)->not->toBeNull();
});

test('user can remove avatar', function (): void {
    Storage::fake('public');

    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.png');
    $user->addMedia($file)->toMediaCollection('avatar');

    expect($user->getFirstMedia('avatar'))->not->toBeNull();

    $response = $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'remove_avatar' => true,
        ]);

    $response->assertRedirect(route('profile.edit'));
    $user->refresh();

    expect($user->getFirstMedia('avatar'))->toBeNull()
        ->and($user->avatar_url)->toBeNull();
});
