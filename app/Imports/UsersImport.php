<?php

declare(strict_types=1);

namespace App\Imports;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToCollection, WithHeadingRow
{
    /** @var array<int, array{row: int, email: string, error: string}> */
    public array $failures = [];

    public int $successCount = 0;

    public int $skippedCount = 0;

    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     */
    public function collection(Collection $rows): void
    {
        $rowNumber = 1; // heading is row 1, data starts row 2

        foreach ($rows as $row) {
            $rowNumber++;

            $name = trim((string) ($row['nama'] ?? $row['name'] ?? ''));
            $email = strtolower(trim((string) ($row['email'] ?? '')));
            $roleInput = strtolower(trim((string) ($row['peran'] ?? $row['role'] ?? 'mahasiswa')));
            $phone = trim((string) ($row['telepon'] ?? $row['phone'] ?? ''));

            if (empty($name) || empty($email)) {
                $this->failures[] = [
                    'row' => $rowNumber,
                    'email' => $email ?: '-',
                    'error' => 'Nama dan Email wajib diisi.',
                ];

                continue;
            }

            if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->failures[] = [
                    'row' => $rowNumber,
                    'email' => $email,
                    'error' => 'Format email tidak valid.',
                ];

                continue;
            }

            if (User::where('email', $email)->exists()) {
                $this->skippedCount++;
                $this->failures[] = [
                    'row' => $rowNumber,
                    'email' => $email,
                    'error' => 'Email sudah terdaftar (dilewati).',
                ];

                continue;
            }

            $role = ($roleInput === 'dosen' || $roleInput === 'teacher')
                ? Role::Dosen->value
                : Role::Mahasiswa->value;

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone ?: null,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $user->assignRole($role);
            $this->successCount++;
        }
    }
}
