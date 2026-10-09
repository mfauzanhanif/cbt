<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\UserImportController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamGradeController;
use App\Http\Controllers\ExamWorkstationController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionPackageController;
use App\Http\Controllers\StudentGradeController;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionPackage;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'home')->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', function () {
        $user = request()->user();

        // Pass overview metrics based on user role
        $stats = [];
        if ($user->hasRole('admin')) {
            $stats = [
                'totalStudents' => User::role('mahasiswa')->count(),
                'totalTeachers' => User::role('dosen')->count(),
                'totalCourses' => Course::count(),
                'totalExams' => Exam::count(),
            ];
        } elseif ($user->hasRole('dosen')) {
            $stats = [
                'taughtCourses' => $user->taughtCourses()->count(),
                'totalQuestions' => Question::where('teacher_id', $user->id)->count(),
                'totalPackages' => QuestionPackage::where('teacher_id', $user->id)->count(),
                'activeExams' => Exam::where('teacher_id', $user->id)->where('is_active', true)->count(),
            ];
        } else {
            $stats = [
                'enrolledCourses' => $user->enrolledCourses()->count(),
                'availableExams' => Exam::whereIn('course_id', $user->enrolledCourses()->pluck('courses.id'))
                    ->where('is_active', true)
                    ->where('start_at', '<=', now())
                    ->where('end_at', '>=', now())
                    ->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Admin-only User & Import Management
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::patch('students/{student}/toggle-status', [StudentController::class, 'toggleStatus'])->name('students.toggle-status');

        Route::get('teachers', [TeacherController::class, 'index'])->name('teachers.index');
        Route::post('teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::put('teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::patch('teachers/{teacher}/toggle-status', [TeacherController::class, 'toggleStatus'])->name('teachers.toggle-status');

        Route::get('import', [UserImportController::class, 'index'])->name('import.index');
        Route::post('import', [UserImportController::class, 'store'])->name('import.store');
        Route::get('import/template', [UserImportController::class, 'downloadTemplate'])->name('import.template');
        Route::get('storage-link', function () {
            Artisan::call('storage:link');
            return response()->json([
                'status' => 'success',
                'message' => 'Symlink storage berhasil dibuat.',
                'output' => Artisan::output(),
            ]);
        })->name('storage-link');
    });

    // Courses Management (Admin, Dosen, Mahasiswa view)
    Route::resource('courses', CourseController::class)->except(['create', 'edit']);
    Route::post('courses/{course}/students', [CourseController::class, 'addStudents'])->name('courses.students.add');
    Route::delete('courses/{course}/students/{student}', [CourseController::class, 'removeStudent'])->name('courses.students.remove');

    // Questions & Question Packages (Dosen & Admin)
    Route::resource('questions', QuestionController::class)->except(['create', 'show', 'edit']);
    Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])->name('questions.duplicate');

    Route::resource('question-packages', QuestionPackageController::class)->except(['create', 'edit']);
    Route::post('question-packages/{package}/sync-questions', [QuestionPackageController::class, 'syncQuestions'])->name('question-packages.sync-questions');

    // Exam Scheduling & Grades (Dosen & Admin)
    Route::resource('exams', ExamController::class)->except(['create', 'show', 'edit']);
    Route::patch('exams/{exam}/toggle-status', [ExamController::class, 'toggleStatus'])->name('exams.toggle-status');
    Route::get('exams/{exam}/grades', [ExamGradeController::class, 'index'])->name('exams.grades.index');
    Route::get('exams/{exam}/grades/export', [ExamGradeController::class, 'export'])->name('exams.grades.export');
    Route::get('exams/{exam}/grades/{attempt}/review', [ExamGradeController::class, 'review'])->name('exams.grades.review');

    // Student Exam Workstation & Grades
    Route::prefix('student')->name('student.')->group(function (): void {
        Route::get('exams', [ExamWorkstationController::class, 'index'])->name('exams.index');
        Route::post('exams/{exam}/start', [ExamWorkstationController::class, 'start'])->name('exams.start');
        Route::get('exams/{exam}/workstation', [ExamWorkstationController::class, 'showWorkstation'])->name('exams.workstation');
        Route::post('exams/{exam}/save-answer', [ExamWorkstationController::class, 'saveAnswer'])->name('exams.save-answer');
        Route::post('exams/{exam}/submit', [ExamWorkstationController::class, 'submit'])->name('exams.submit');
        Route::get('exams/{exam}/success', [ExamWorkstationController::class, 'success'])->name('exams.success');

        Route::get('grades', [StudentGradeController::class, 'index'])->name('grades.index');
        Route::get('grades/{attempt}/review', [StudentGradeController::class, 'review'])->name('grades.review');
    });
});

require __DIR__.'/settings.php';
