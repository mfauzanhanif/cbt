<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $teacher_id
 * @property int $package_id
 * @property int $course_id
 * @property string $name
 * @property Carbon $start_at
 * @property Carbon $end_at
 * @property int $duration_minutes
 * @property bool $is_active
 * @property bool $shuffle_questions
 * @property bool $show_result
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $teacher
 * @property-read QuestionPackage $package
 * @property-read Course $course
 * @property-read Collection<int, ExamAttempt> $attempts
 */
#[Fillable([
    'teacher_id',
    'package_id',
    'course_id',
    'name',
    'start_at',
    'end_at',
    'duration_minutes',
    'is_active',
    'shuffle_questions',
    'show_result',
])]
class Exam extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'duration_minutes' => 'integer',
            'is_active' => 'boolean',
            'shuffle_questions' => 'boolean',
            'show_result' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * @return BelongsTo<QuestionPackage, $this>
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(QuestionPackage::class, 'package_id');
    }

    /**
     * @return BelongsTo<Course, $this>
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * @return HasMany<ExamAttempt, $this>
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(ExamAttempt::class, 'exam_id');
    }
}
