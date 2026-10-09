<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportUsersRequest;
use App\Imports\UsersImport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/import/index', [
            'importReport' => session('importReport'),
        ]);
    }

    public function store(ImportUsersRequest $request): RedirectResponse
    {
        $file = $request->file('file');
        $import = new UsersImport;

        /** @var UploadedFile $file */
        Excel::import($import, $file);

        $report = [
            'successCount' => $import->successCount,
            'skippedCount' => $import->skippedCount,
            'failureCount' => count($import->failures),
            'failures' => $import->failures,
        ];

        return redirect()->route('admin.import.index')
            ->with('importReport', $report)
            ->with('success', "Proses impor selesai. {$import->successCount} akun berhasil ditambahkan.");
    }

    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="template_impor_pengguna_cbt.csv"',
        ];

        return response()->stream(function (): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            // UTF-8 BOM for Excel compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            // Header row
            fputcsv($handle, ['nama', 'email', 'peran', 'telepon']);

            // Sample rows
            fputcsv($handle, ['Budi Santoso', 'budi.santoso@kampus.ac.id', 'mahasiswa', '081234567891']);
            fputcsv($handle, ['Dr. Siti Rahmawati, M.T.', 'siti.rahmawati@kampus.ac.id', 'dosen', '081298765431']);

            fclose($handle);
        }, 200, $headers);
    }
}
