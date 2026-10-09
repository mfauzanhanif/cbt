<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('package_id')->constrained('question_packages')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('name');
            $table->timestamp('start_at');
            $table->timestamp('end_at');
            $table->unsignedInteger('duration_minutes');
            $table->boolean('is_active')->default(true);
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('show_result')->default(true);
            $table->timestamps();

            $table->index(['teacher_id', 'is_active']);
            $table->index(['course_id', 'is_active', 'start_at', 'end_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
