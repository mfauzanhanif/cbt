<?php

declare(strict_types=1);

/**
 * Script untuk membuat arsip ZIP produksi Laravel secara cross-platform.
 * Kompatibel 100% dengan cPanel File Manager dan Linux unzip standar.
 */

$rootDir = realpath(__DIR__ . '/..');
if (!$rootDir || !is_dir($rootDir)) {
    fwrite(STDERR, "Error: Direktori proyek tidak ditemukan.\n");
    exit(1);
}

$outputDir = isset($argv[1]) ? $argv[1] : dirname($rootDir);
$outputName = isset($argv[2]) ? $argv[2] : 'cbt.zip';

// Pastikan output directory ada
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

$zipPath = rtrim($outputDir, '/\\') . DIRECTORY_SEPARATOR . $outputName;

echo "==> Membuat arsip ZIP: {$zipPath}\n";

if (file_exists($zipPath)) {
    unlink($zipPath);
}

$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    fwrite(STDERR, "Error: Tidak dapat membuka/membuat file ZIP di {$zipPath}\n");
    exit(1);
}

// Daftar pola file/folder yang diexclude
$excludePatterns = [
    '#^node_modules(/|$)#i',
    '#^\.git(/|$)#i',
    '#^\.github(/|$)#i',
    '#^\.agents(/|$)#i',
    '#^tests(/|$)#i',
    '#^\.env(\..+)?$#i',
    '#^\.editorconfig$#i',
    '#^\.gitattributes$#i',
    '#^\.npmrc$#i',
    '#^phpunit\.xml$#i',
    '#^phpstan\.neon$#i',
    '#^pint\.json$#i',
    '#^boost\.json$#i',
    '#^AGENTS\.md$#i',
    '#^GEMINI\.md$#i',
    '#^README\.md$#i',
    '#^Makefile$#i',
    '#^scripts(/|$)#i',
    '#^public/hot$#i',
    '#^storage/logs/.*\.log$#i',
    '#^storage/framework/cache/data/.+#i',
    '#^storage/framework/sessions/.+#i',
    '#^storage/framework/views/.+#i',
];

// Pastikan folder-folder penting storage & cache selalu ada di ZIP
$mandatoryDirs = [
    'storage/app/public',
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];

foreach ($mandatoryDirs as $dir) {
    $zip->addEmptyDir($dir);
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$fileCount = 0;

foreach ($iterator as $item) {
    $filePath = $item->getRealPath();
    if (!$filePath) {
        continue;
    }

    $relativePath = ltrim(str_replace(['\\', $rootDir], ['/', ''], $filePath), '/');

    // Cek apakah relativePath cocok dengan exclude
    $isExcluded = false;
    foreach ($excludePatterns as $pattern) {
        if (preg_match($pattern, $relativePath)) {
            $isExcluded = true;
            break;
        }
    }

    if ($isExcluded) {
        continue;
    }

    if ($item->isDir()) {
        $zip->addEmptyDir($relativePath);
    } elseif ($item->isFile()) {
        $zip->addFile($filePath, $relativePath);
        $fileCount++;
    }
}

$zip->close();

$sizeMb = round(filesize($zipPath) / (1024 * 1024), 2);
echo "✔ SUKSES: {$fileCount} file berhasil dikompresi ke {$zipPath} ({$sizeMb} MB).\n";
