<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExamGradesExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    private int $rowNumber = 0;

    /**
     * @var Collection<int, ExamAttempt>
     */
    private Collection $attempts;

    public function __construct(public Exam $exam)
    {
        $this->attempts = ExamAttempt::where('exam_id', $this->exam->id)
            ->get()
            ->keyBy('student_id');
    }

    /**
     * @return Collection<int, User>
     */
    public function collection(): Collection
    {
        return $this->exam->course->students()
            ->orderBy('name')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Mahasiswa',
            'Alamat Email',
            'Nomor Telepon',
            'Status Pengerjaan',
            'Waktu Selesai',
            'Nilai Akhir',
        ];
    }

    /**
     * @param  User  $row
     * @return array<int, mixed>
     */
    public function map($row): array
    {
        $this->rowNumber++;
        $attempt = $this->attempts->get($row->id);

        $status = 'Belum Mulai';
        $submittedAt = '-';
        $score = '-';

        if ($attempt !== null) {
            if ($attempt->status === 'submitted' || $attempt->status === 'graded') {
                $status = 'Selesai';
                $submittedAt = $attempt->submitted_at ? $attempt->submitted_at->format('d/m/Y H:i:s') : '-';
                $score = $attempt->score !== null ? (string) $attempt->score : '0';
            } elseif ($attempt->status === 'in_progress') {
                $status = 'Sedang Mengerjakan';
            }
        }

        return [
            $this->rowNumber,
            $row->name,
            $row->email,
            $row->phone ?? '-',
            $status,
            $submittedAt,
            $score,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $lastRow = $this->rowNumber + 1;

        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 11,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1C293C'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
            // Data borders
            "A1:G{$lastRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CBD5E1'],
                    ],
                ],
            ],
        ];
    }

    public function title(): string
    {
        return 'Rekap Nilai';
    }
}
