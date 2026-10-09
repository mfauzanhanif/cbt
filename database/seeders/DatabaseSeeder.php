<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuestionPackage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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

        // 2. Seed roles
        $this->call(RoleSeeder::class);

        // 3. Create default Admin account
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

        // 4. Create default Dosen account
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

        // 5. Create default Mahasiswa account
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

        // 6. Create default Inactive test account
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

        // 7. Create Sample Courses
        $course1 = Course::firstOrCreate(
            ['code' => 'PWL-101'],
            [
                'teacher_id' => $dosen->id,
                'name' => 'Pemrograman Web Lanjut (Laravel & React)',
                'description' => 'Mata kuliah pengembangan web modern berbasis full-stack Laravel dan React Inertia.',
            ]
        );
        $course1->students()->syncWithoutDetaching([$mahasiswa->id]);

        $course2 = Course::firstOrCreate(
            ['code' => 'SDA-201'],
            [
                'teacher_id' => $dosen->id,
                'name' => 'Struktur Data & Algoritma',
                'description' => 'Mempelajari konsep linked list, tree, graph, sorting, dan evaluasi kompleksitas Big-O.',
            ]
        );
        $course2->students()->syncWithoutDetaching([$mahasiswa->id]);

        // 8. Create Sample Questions for Dosen
        $q1 = Question::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'text' => 'Manakah di bawah ini yang merupakan fitur bawaan Laravel Fortify untuk autentikasi?',
            ],
            [
                'type' => 'single_choice',
                'difficulty' => 'mudah',
                'explanation' => 'Laravel Fortify menyediakan backend autentikasi tanpa tampilan (headless) termasuk registrasi, login, reset kata sandi, dan verifikasi email.',
            ]
        );

        $q1Options = [
            ['label' => 'A', 'text' => 'Komponen UI Blade otomatis dengan Bootstrap', 'is_correct' => false],
            ['label' => 'B', 'text' => 'Backend autentikasi headless: login, register, reset password, email verification', 'is_correct' => true],
            ['label' => 'C', 'text' => 'CSS Framework berbasis utility classes', 'is_correct' => false],
            ['label' => 'D', 'text' => 'Sistem operasi berbasis Linux untuk container', 'is_correct' => false],
        ];

        foreach ($q1Options as $opt) {
            QuestionOption::firstOrCreate(
                ['question_id' => $q1->id, 'label' => $opt['label']],
                ['text' => $opt['text'], 'is_correct' => $opt['is_correct']]
            );
        }

        $q2 = Question::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'text' => 'Dalam desain Functional Neo-Brutalism, karakteristik bayangan (box-shadow) yang digunakan adalah...',
            ],
            [
                'type' => 'single_choice',
                'difficulty' => 'sedang',
                'explanation' => 'Neo-brutalism menggunakan hard block offset shadow tanpa Gaussian blur (misal: 4px 4px 0px #1C293C).',
            ]
        );

        $q2Options = [
            ['label' => 'A', 'text' => 'Soft blur shadow dengan opacity 10% dan radius besar', 'is_correct' => false],
            ['label' => 'B', 'text' => 'Hard block offset shadow 45 derajat tanpa blur (zero-blur)', 'is_correct' => true],
            ['label' => 'C', 'text' => 'Glow neon dengan filter filter(drop-shadow)', 'is_correct' => false],
            ['label' => 'D', 'text' => 'Inner shadow kabur menyerupai neumorphism', 'is_correct' => false],
        ];

        foreach ($q2Options as $opt) {
            QuestionOption::firstOrCreate(
                ['question_id' => $q2->id, 'label' => $opt['label']],
                ['text' => $opt['text'], 'is_correct' => $opt['is_correct']]
            );
        }

        $q3 = Question::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'text' => 'Metode manakah yang paling tepat untuk mencegah N+1 query problem pada pemanggilan relasi Eloquent di Laravel?',
            ],
            [
                'type' => 'single_choice',
                'difficulty' => 'sedang',
                'explanation' => 'Eager loading dengan with() memuat relasi sekaligus dalam query terpisah yang teroptimasi.',
            ]
        );

        $q3Options = [
            ['label' => 'A', 'text' => 'Eager Loading menggunakan method with()', 'is_correct' => true],
            ['label' => 'B', 'text' => 'Lazy Loading saat iterasi foreach', 'is_correct' => false],
            ['label' => 'C', 'text' => 'Menghapus foreign key pada tabel database', 'is_correct' => false],
            ['label' => 'D', 'text' => 'Menggunakan raw SQL query tanpa binding parameter', 'is_correct' => false],
        ];

        foreach ($q3Options as $opt) {
            QuestionOption::firstOrCreate(
                ['question_id' => $q3->id, 'label' => $opt['label']],
                ['text' => $opt['text'], 'is_correct' => $opt['is_correct']]
            );
        }

        // 9. Create Sample Question Package
        $package = QuestionPackage::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'name' => 'Paket Soal UTS Pemrograman Web Lanjut 2026',
            ],
            [
                'description' => 'Paket soal evaluasi tengah semester mencakup materi Fortify, Inertia v3, dan arsitektur database modern.',
            ]
        );

        $package->questions()->sync([
            $q1->id => ['order' => 1],
            $q2->id => ['order' => 2],
            $q3->id => ['order' => 3],
        ]);

        // 10. Create Sample Exam
        Exam::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'course_id' => $course1->id,
                'name' => 'UTS Pemrograman Web Lanjut Semester Ganjil',
            ],
            [
                'package_id' => $package->id,
                'start_at' => now()->subDay(),
                'end_at' => now()->addDays(7),
                'duration_minutes' => 60,
                'is_active' => true,
                'shuffle_questions' => false,
                'show_result' => true,
            ]
        );
    }
}
