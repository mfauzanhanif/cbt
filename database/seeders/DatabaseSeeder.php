<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Call modular seeders in sequence
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CourseSeeder::class,
            QuestionSeeder::class,
            QuestionPackageSeeder::class,
            ExamSeeder::class,
        ]);
    }
}
