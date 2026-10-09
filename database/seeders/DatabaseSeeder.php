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

        // 4. Create default Dosen account (Jazariyah)
        $dosen = User::firstOrCreate(
            ['email' => 'jazariyah@fauzanhanif.my.id'],
            [
                'name' => 'Jazariyah',
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

        // 7. Create Course: Literasi Digital Pembelajaran Bahasa Arab (Kelas Pendidikan Bahasa Arab)
        $course = Course::firstOrCreate(
            ['code' => 'PBA-LDPBA'],
            [
                'teacher_id' => $dosen->id,
                'name' => 'Literasi Digital Pembelajaran Bahasa Arab',
                'description' => 'Kelas Pendidikan Bahasa Arab - Perkuliahan literasi digital untuk inovasi pengajaran bahasa Arab.',
            ]
        );
        $course->students()->syncWithoutDetaching([$mahasiswa->id]);

        // 8. Create 10 High Quality Multiple Choice Questions
        $questionsData = [
            [
                'text' => 'Aplikasi kamus digital multibahasa yang sangat populer dan sering dijadikan rujukan utama dalam mencari derivasi akar kata (tashrif) serta sinonim istilah bahasa Arab modern secara cepat adalah...',
                'difficulty' => 'mudah',
                'explanation' => 'Kamus Almaany (almaany.com) adalah leksikografi digital bahasa Arab komprehensif yang menyediakan makna mu\'jam mufashshal, kamus kontekstual Arab-Indonesia/Inggris, serta derivasi wazan dan tashrif kata.',
                'options' => [
                    ['label' => 'A', 'text' => 'Duolingo', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Almaany (المعاني)', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Google Translate', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Canva for Education', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Dalam kajian linguistik korpus bahasa Arab, pemanfaatan Korpus Arab Digital (Arabic Corpus / Arabic Learner Corpus) terutama berfungsi untuk...',
                'difficulty' => 'sedang',
                'explanation' => 'Korpus linguistik Arab menyediakan basis data teks autentik skala besar yang memungkinkan pembelajar menganalisis pola konkordansi (concordance), kolokasi kata, dan distribusi frekuensi kosakata dalam konteks nyata.',
                'options' => [
                    ['label' => 'A', 'text' => 'Menggantikan fungsi dosen sepenuhnya dalam pengajaran qawa\'id di kelas', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Menganalisis konkordansi kata, frekuensi kemunculan mufrodat, dan konteks autentik penggunaan kata dalam kalimat', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Mencetak buku teks bahasa Arab secara otomatis tanpa penyuntingan', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Mengubah format rekaman audio ceramah menjadi teks tanpa koneksi internet', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Platform berbasis gamifikasi interaktif seperti Wordwall dan Quizizz dalam pembelajaran bahasa Arab paling tepat diintegrasikan pada tahapan...',
                'difficulty' => 'mudah',
                'explanation' => 'Wordwall dan Quizizz memiliki fitur gamifikasi (game-based learning) seperti kuis cepat, menjodohkan kata, dan roda acak yang sangat efektif untuk asesmen formatif pemahaman mufrodat dan qawa\'id.',
                'options' => [
                    ['label' => 'A', 'text' => 'Pengunggahan nilai kelulusan akhir semester ke pangkalan data perguruan tinggi', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Asesmen formatif mufrodat (kosakata) dan tarkib secara menyenangkan dan kompetitif', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Pembuatan silabus perkuliahan dan kurikulum nasional', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Pengarsipan dokumen fisik karya ilmiah mahasiswa', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Standar encoding digital internasional yang memastikan karakter abjad Arab (termasuk tanda baca harakat) dapat disimpan, dipertukarkan, dan ditampilkan secara konsisten di seluruh sistem operasi dan peramban web modern adalah...',
                'difficulty' => 'sedang',
                'explanation' => 'Standar Unicode (khususnya skema UTF-8) mencakup rentang blok khusus untuk huruf Arab (U+0600 hingga U+06FF) dan tanda harakat sehingga rendering teks Arab tidak mengalami kerusakan karakter (mojibake).',
                'options' => [
                    ['label' => 'A', 'text' => 'ASCII 7-bit', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Unicode (UTF-8)', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'ANSI Windows-1252', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'ISO-8859-1', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Bagaimanakah etika dan sikap akademis yang bijak bagi mahasiswa saat memanfaatkan Large Language Model (seperti ChatGPT atau Claude) dalam tugas penerjemahan teks bahasa Arab ke bahasa Indonesia?',
                'difficulty' => 'sedang',
                'explanation' => 'Literasi digital menuntut integritas akademik dan pemikiran kritis: AI dapat dimanfaatkan sebagai alat bantu perbandingan draf terjemahan, namun verifikasi manusia (human-in-the-loop) tetap mutlak untuk memastikan akurasi makna dan estetika bahasa.',
                'options' => [
                    ['label' => 'A', 'text' => 'Menyalin seluruh hasil terjemahan mesin secara langsung tanpa membaca ulang kaidah nahwu-sharaf', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Memanfaatkan AI sebagai asisten pembanding sembari melakukan telaah kritis, verifikasi konteks balaghah, dan perbaikan kaidah gramatika', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Menolak penggunaan seluruh teknologi digital dan hanya mengandalkan cetakan fisik abad pertengahan', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Mengklaim terjemahan murni dari kecerdasan buatan sebagai karya orisinal pribadi tanpa atribusi', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Teknologi Text-to-Speech (TTS) berbasis kecerdasan buatan yang menghasilkan pelafalan fashih dan intonasi makharijul huruf yang natural sangat bermanfaat untuk menunjang keterampilan berbahasa Arab pada aspek...',
                'difficulty' => 'mudah',
                'explanation' => 'Teknologi TTS menghasilkan audio sintetis teks Arab berharakat yang dapat didengarkan berulang kali oleh pembelajar guna melatih kepekaan fonologi (istima\') serta memodelkan intonasi pelafalan yang tepat (kalam).',
                'options' => [
                    ['label' => 'A', 'text' => 'Maharah al-Istima\' (Keterampilan Mendengar) dan Maharah al-Kalam (Berbicara)', 'is_correct' => true],
                    ['label' => 'B', 'text' => 'Maharah al-Kitabah (Menulis kaligrafi murni) saja', 'is_correct' => false],
                    ['label' => 'C', 'text' => 'Administrasi absensi kehadiran di kelas tatap muka', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Desain tata letak sampul majalah dinding kampus', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Saat mengetik teks bahasa Arab pada papan ketik standar komputer (Arabic 101 Keyboard Layout) di sistem operasi Windows, kombinasi tombol pintas (keyboard shortcut) untuk membubuhkan tanda harakat Fathatain (ً) adalah...',
                'difficulty' => 'sulit',
                'explanation' => 'Pada tata letak keyboard Arabic (101), Shift + Q menghasilkan tanda Fathah, Shift + W menghasilkan tanda Fathatain (tanwin fathah), Shift + E menghasilkan tanda Dhammah, dan Shift + R menghasilkan tanda Dhammatain.',
                'options' => [
                    ['label' => 'A', 'text' => 'Shift + Q', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Shift + W', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Shift + E', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Shift + X', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Pemanfaatan aplikasi komputasi awan kolaboratif seperti Google Docs dalam pembelajaran Maharah al-Kitabah (insya\'/mengarang) memberikan keuntungan utama berupa...',
                'difficulty' => 'mudah',
                'explanation' => 'Fitur komentar, saran pengeditan (suggesting mode), dan riwayat revisi pada Google Docs memfasilitasi bimbingan proses menulis (process writing approach) yang interaktif antara dosen dan rekan sejawat.',
                'options' => [
                    ['label' => 'A', 'text' => 'Kemampuan memberikan koreksi (peer-review) langsung, riwayat revisi (version history), dan catatan komentar dosen secara real-time', 'is_correct' => true],
                    ['label' => 'B', 'text' => 'Menjamin karangan bahasa Arab bebas dari segala jenis kesalahan gramatika secara magis', 'is_correct' => false],
                    ['label' => 'C', 'text' => 'Menghapus kebutuhan mahasiswa untuk mempelajari kaidah imla\' dan tanda baca', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Mengubah teks Arab menjadi animasi video secara otomatis tanpa instruksi', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Dalam ekosistem pembelajaran bahasa Arab secara daring (blended learning), Learning Management System (LMS) seperti Moodle atau Google Classroom berfungsi utama sebagai...',
                'difficulty' => 'mudah',
                'explanation' => 'LMS merupakan platform terintegrasi untuk mengorganisasikan modul pembelajaran, mengunggah materi audio-visual, mengelola tenggat tugas, serta memantau keaktifan peserta didik secara terstruktur.',
                'options' => [
                    ['label' => 'A', 'text' => 'Perangkat keras untuk mencetak soal lembar jawaban komputer', 'is_correct' => false],
                    ['label' => 'B', 'text' => 'Pusat pengelolaan materi perkuliahan, penugasan terstruktur, forum diskusi asinkron, dan pelacakan progres belajar mahasiswa', 'is_correct' => true],
                    ['label' => 'C', 'text' => 'Media sosial hiburan tanpa kendali akademik', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Aplikasi pemutar video siaran televisi Arab secara gratis', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Teknologi Optical Character Recognition (OCR) teks bahasa Arab sangat berguna dalam literasi digital karena mampu...',
                'difficulty' => 'sedang',
                'explanation' => 'OCR bahasa Arab mengenali glif dan karakter dari pindaian citra kitab klasik (turats) atau dokumen fisik lalu mengubahnya menjadi representasi teks digital Unicode yang dapat ditelusuri kata kuncinya dan diedit pada pengolah kata.',
                'options' => [
                    ['label' => 'A', 'text' => 'Mengonversi dokumen gambar atau pindaian PDF kitab Arab cetak menjadi teks digital yang dapat disalin, diedit, dan dicari (searchable)', 'is_correct' => true],
                    ['label' => 'B', 'text' => 'Merekam percakapan langsung di kelas dan mengunggahnya ke media sosial', 'is_correct' => false],
                    ['label' => 'C', 'text' => 'Menciptakan alat pengeras suara otomatis di laboratorium bahasa', 'is_correct' => false],
                    ['label' => 'D', 'text' => 'Menggantikan fungsi proyektor LCD di ruang kuliah', 'is_correct' => false],
                ],
            ],
        ];

        $packageQuestionMap = [];
        $order = 1;

        foreach ($questionsData as $qData) {
            $question = Question::firstOrCreate(
                [
                    'teacher_id' => $dosen->id,
                    'text' => $qData['text'],
                ],
                [
                    'type' => 'single_choice',
                    'difficulty' => $qData['difficulty'],
                    'explanation' => $qData['explanation'],
                ]
            );

            foreach ($qData['options'] as $opt) {
                QuestionOption::firstOrCreate(
                    [
                        'question_id' => $question->id,
                        'label' => $opt['label'],
                    ],
                    [
                        'text' => $opt['text'],
                        'is_correct' => $opt['is_correct'],
                    ]
                );
            }

            $packageQuestionMap[$question->id] = ['order' => $order++];
        }

        // 9. Create Sample Question Package
        $package = QuestionPackage::firstOrCreate(
            [
                'teacher_id' => $dosen->id,
                'name' => 'Paket Soal UTS Literasi Digital Pembelajaran Bahasa Arab',
            ],
            [
                'description' => 'Paket soal evaluasi tengah semester mencakup materi kamus digital, korpus linguistik Arab, gamifikasi, standar Unicode, etika AI, TTS, OCR, dan integrasi LMS.',
            ]
        );

        $package->questions()->sync($packageQuestionMap);

        // 10. Create Sample Exam
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
