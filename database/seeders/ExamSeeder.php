<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Exam;
use App\Models\QuestionPackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen = User::where('email', 'dosen@fauzanhanif.my.id')->first();
        $course = Course::where('code', 'PBA-LDPBA')->first();
        $package = QuestionPackage::where('name', 'Paket Soal UTS Literasi Digital Pembelajaran Bahasa Arab')->first();

        if (! $dosen || ! $course || ! $package) {
            return;
        }

        // Create Sample Exam
        Exam::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'course_id' => $course->id,
                'name' => 'UTS Literasi Digital Pembelajaran Bahasa Arab',
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
