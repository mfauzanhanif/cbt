<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create default Admin account
        $admin = User::firstOrCreate(
            ['email' => 'admin@fauzanhanif.my.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '081234567890',
            ]
        );
        $admin->syncRoles([Role::Admin->value]);

        // 2. Create default Dosen account
        $dosen = User::firstOrCreate(
            ['email' => 'dosen@fauzanhanif.my.id'],
            [
                'name' => 'Dosen',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '081298765432',
            ]
        );
        $dosen->syncRoles([Role::Dosen->value]);

        // 3. Create default Mahasiswa account
        $mahasiswa = User::firstOrCreate(
            ['email' => 'mahasiswa@fauzanhanif.my.id'],
            [
                'name' => 'Mahasiswa',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '085712345678',
            ]
        );
        $mahasiswa->syncRoles([Role::Mahasiswa->value]);

        // 4. Create default Inactive test account
        $inactive = User::firstOrCreate(
            ['email' => 'inactive@cbt.test'],
            [
                'name' => 'User Nonaktif',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => false,
                'phone' => '089999999999',
            ]
        );
        $inactive->syncRoles([Role::Mahasiswa->value]);
    }
}
