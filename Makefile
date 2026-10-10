# ==============================================================================
# Makefile - CBT (Computer Based Test) Deployment & Development Automation
# ==============================================================================

# Variables
APP_NAME     ?= cbt
CBT_TAR      ?= $(APP_NAME).tar.gz
CBT_ARCHIVE  ?= $(CBT_TAR)
DB_ARCHIVE   ?= $(APP_NAME).sql
DB_NAME      ?= cbt
DB_USER      ?= root
OUTPUT_DIR   ?= .

.PHONY: help dev build install fresh migrate seed test lint types clean deploy deploy-cbt deploy-db

help:
	@echo "======================================================================"
	@echo " CBT (Computer Based Test) - Development & Deployment Toolkit"
	@echo "======================================================================"
	@echo "Penggunaan: make [target]"
	@echo ""
	@echo "Pengembangan Lokal (Development):"
	@echo "  dev          Jalankan server pengembangan lokal (PHP & Vite)"
	@echo "  build        Kompilasi aset frontend untuk produksi (pnpm run build)"
	@echo "  install      Pasang dependensi PHP & Node (composer + pnpm)"
	@echo "  migrate      Jalankan database migration"
	@echo "  fresh        Migrate fresh dengan seeding database lengkap"
	@echo "  seed         Jalankan database seeder"
	@echo "  test         Jalankan rangkaian pengujian otomatis (Pest)"
	@echo "  lint         Jalankan code linter & formatter (Pint)"
	@echo "  types        Cek type-checking TypeScript"
	@echo "  clean        Bersihkan cache Laravel & file dev sementara"
	@echo ""
	@echo "Deployment / Packaging (Shared Hosting cPanel tanpa SSH & Node.js):"
	@echo "  deploy       Siapkan arsip produksi .tar.gz dan dump database .sql"
	@echo "  deploy-cbt   Build frontend, optimasi composer, dan arsipkan ke .tar.gz"
	@echo "  deploy-db    Ekspor database MySQL ke file .sql (siap import phpMyAdmin)"
	@echo "======================================================================"

dev:
	@composer run dev

build:
	@pnpm run build

install:
	@composer install
	@pnpm install

migrate:
	@php artisan migrate

fresh:
	@php artisan migrate:fresh --seed

seed:
	@php artisan db:seed

test:
	@php artisan test

lint:
	@composer run lint

types:
	@pnpm run types:check

clean:
	@echo "==> Membersihkan cache Laravel & file sementara..."
	@php artisan optimize:clear
	@rm -f public/hot

deploy: deploy-cbt deploy-db

# Target arsip TAR.GZ untuk deployment CBT
deploy-cbt:
	@echo "==> [1/6] Menghapus file public/hot (jika ada)..."
	@rm -f public/hot
	@echo "==> [2/6] Membersihkan cache lokal Laravel..."
	@php artisan optimize:clear
	@echo "==> [3/6] Membangun aset frontend produksi (React + Vite)..."
	@pnpm run build
	@echo "==> [4/6] Mengoptimalkan autoloader & menghapus dev-dependencies composer..."
	@composer install --optimize-autoloader --no-dev
	@echo "==> [5/6] Mengompresi aplikasi monolith ke $(OUTPUT_DIR)/$(CBT_TAR)..."
	@rm -f $(OUTPUT_DIR)/$(CBT_TAR)
	@tar -czf $(OUTPUT_DIR)/$(CBT_TAR) \
		--exclude="node_modules" \
		--exclude="$(CBT_TAR)" \
		--exclude="$(DB_ARCHIVE)" \
		--exclude="*.tar.gz" \
		--exclude="*.sql" \
		--exclude="pnpm-lock.yaml" \
		--exclude="pnpm-workspace.yaml" \
		--exclude="package.json" \
		--exclude="tsconfig.json" \
		--exclude="vite.config.ts" \
		--exclude="components.json" \
		--exclude=".git" \
		--exclude=".github" \
		--exclude=".agents" \
		--exclude=".vscode" \
		--exclude=".idea" \
		--exclude="docs" \
		--exclude="tests" \
		--exclude=".phpunit.cache" \
		--exclude="phpunit.xml" \
		--exclude="phpstan.neon" \
		--exclude="pint.json" \
		--exclude="boost.json" \
		--exclude=".env" \
		--exclude=".env.*" \
		--exclude=".editorconfig" \
		--exclude=".gitattributes" \
		--exclude=".npmrc" \
		--exclude=".DS_Store" \
		--exclude="AGENTS.md" \
		--exclude="GEMINI.md" \
		--exclude="README.md" \
		--exclude="Makefile" \
		--exclude="public/hot" \
		--exclude="public/storage" \
		--exclude="public/fonts-manifest.dev.json" \
		--exclude="storage/logs/*.log" \
		--exclude="storage/framework/cache/data/*" \
		--exclude="storage/framework/sessions/*" \
		--exclude="storage/framework/views/*" \
		.
	@echo "==> [6/6] Mengembalikan dev-dependencies composer untuk local development..."
	@composer install
	@echo "✔ SUKSES: $(OUTPUT_DIR)/$(CBT_TAR) siap diupload dan diekstrak di server."

# Target dump database SQL
deploy-db:
	@echo "==> Melakukan mysqldump untuk database $(DB_NAME)..."
	@rm -f $(OUTPUT_DIR)/$(DB_ARCHIVE)
	@mysqldump -u $(DB_USER) --single-transaction --quick --set-gtid-purged=OFF $(DB_NAME) > $(OUTPUT_DIR)/$(DB_ARCHIVE)
	@echo "✔ SUKSES: $(OUTPUT_DIR)/$(DB_ARCHIVE) siap diimpor ke phpMyAdmin cPanel."
