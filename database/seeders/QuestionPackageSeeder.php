<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionPackage;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen = User::where('email', 'dosen@fauzanhanif.my.id')->first();

        if (! $dosen) {
            return;
        }

        // Create Sample Question Package
        $package = QuestionPackage::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'name' => 'Paket Soal UTS Literasi Digital Pembelajaran Bahasa Arab',
            ],
            [
                'description' => 'Paket soal evaluasi tengah semester mencakup materi kamus digital, korpus linguistik Arab, gamifikasi, standar Unicode, etika AI, TTS, OCR, dan integrasi LMS.',
            ]
        );

        // Fetch questions created by this teacher
        $questions = Question::where('teacher_id', $dosen->id)->orderBy('id')->get();

        $packageQuestionMap = [];
        $order = 1;
        foreach ($questions as $question) {
            $packageQuestionMap[$question->id] = ['order' => $order++];
        }

        if (! empty($packageQuestionMap)) {
            $package->questions()->sync($packageQuestionMap);
        }
    }
}
