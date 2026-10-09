# Variables
APP_NAME     ?= cbt
CBT_ARCHIVE  ?= $(APP_NAME).tar.gz
DB_ARCHIVE   ?= $(APP_NAME).sql
DB_NAME      ?= cbt
DB_USER      ?= root
OUTPUT_DIR   ?= ..

.PHONY: help dev build install fresh migrate seed test lint types clean deploy deploy-cbt deploy-db

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development:"
	@echo "  dev          Jalankan local development server (PHP & Vite)"
	@echo "  build        Kompilasi aset frontend untuk produksi (pnpm run build)"
	@echo "  install      Install dependensi PHP & Node (composer + pnpm)"
	@echo "  migrate      Jalankan database migration"
	@echo "  fresh        Migrate fresh dengan seeding database"
	@echo "  seed         Jalankan database seeder"
	@echo "  test         Jalankan test suite"
	@echo "  lint         Jalankan code linter & formatter (Pint)"
	@echo "  types        Cek type-checking TypeScript"
	@echo "  clean        Bersihkan cache Laravel & file sementara"
	@echo ""
	@echo "Deployment / Packaging:"
	@echo "  deploy       Siapkan arsip monolith dan dump database"
	@echo "  deploy-cbt   Build frontend, optimasi autoloader, dan arsipkan monolith ke tar.gz"
	@echo "  deploy-db    Ekspor database MySQL ke file .sql"

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
	@echo "==> Membersihkan cache Laravel & file dev..."
	@php artisan optimize:clear
	@rm -f public/hot

deploy: deploy-cbt deploy-db

deploy-cbt:
	@echo "==> Menghapus file public/hot (jika ada)..."
	@rm -f public/hot
	@echo "==> Membersihkan cache lokal Laravel..."
	@php artisan optimize:clear
	@echo "==> Membangun aset frontend produksi (React + Vite)..."
	@pnpm run build
	@echo "==> Mengoptimalkan autoloader & menghapus dev-dependencies composer..."
	@composer install --optimize-autoloader --no-dev
	@echo "==> Mengkompresi aplikasi monolith ke $(OUTPUT_DIR)/$(CBT_ARCHIVE)..."
	@rm -f $(OUTPUT_DIR)/$(CBT_ARCHIVE)
	@tar -czf $(OUTPUT_DIR)/$(CBT_ARCHIVE) \
		--exclude="node_modules" \
		--exclude=".git" \
		--exclude=".github" \
		--exclude=".agents" \
		--exclude="tests" \
		--exclude=".env" \
		--exclude=".env.*" \
		--exclude=".editorconfig" \
		--exclude=".gitattributes" \
		--exclude=".gitignore" \
		--exclude=".npmrc" \
		--exclude="phpunit.xml" \
		--exclude="phpstan.neon" \
		--exclude="pint.json" \
		--exclude="boost.json" \
		--exclude="AGENTS.md" \
		--exclude="GEMINI.md" \
		--exclude="README.md" \
		--exclude="public/hot" \
		--exclude="storage/logs/*" \
		--exclude="storage/framework/cache/data/*" \
		--exclude="storage/framework/sessions/*" \
		--exclude="storage/framework/views/*" \
		.
	@echo "==> Mengembalikan dev-dependencies composer untuk local development..."
	@composer install
	@echo "✔ $(OUTPUT_DIR)/$(CBT_ARCHIVE) siap diupload ke cPanel/Shared Hosting."

deploy-db:
	@echo "==> Melakukan mysqldump untuk database $(DB_NAME)..."
	@rm -f $(OUTPUT_DIR)/$(DB_ARCHIVE)
	@mysqldump -u $(DB_USER) --set-gtid-purged=OFF $(DB_NAME) > $(OUTPUT_DIR)/$(DB_ARCHIVE)
	@echo "✔ $(OUTPUT_DIR)/$(DB_ARCHIVE) siap diupload."
