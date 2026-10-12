<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dosen = User::where('email', 'dosen@fauzanhanif.my.id')->first();
        $mahasiswa = User::where('email', 'mahasiswa@fauzanhanif.my.id')->first();

        if (! $dosen || ! $mahasiswa) {
            return;
        }

        // Create Course: Literasi Digital Pembelajaran Bahasa Arab (Kelas Pendidikan Bahasa Arab)
        $course = Course::firstOrCreate(
            ['code' => 'PBA-LDPBA'],
            [
                'teacher_id' => $dosen->id,
                'name' => 'Literasi Digital Pembelajaran Bahasa Arab',
                'description' => 'Kelas Pendidikan Bahasa Arab - Perkuliahan literasi digital untuk inovasi pengajaran bahasa Arab.',
            ]
        );

        $course->students()->syncWithoutDetaching([$mahasiswa->id]);
    }
}
