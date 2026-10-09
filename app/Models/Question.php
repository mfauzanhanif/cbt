<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property int $id
 * @property int $teacher_id
 * @property string $type
 * @property string $text
 * @property string|null $explanation
 * @property string|null $difficulty
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $teacher
 * @property-read Collection<int, QuestionOption> $options
 * @property-read Collection<int, QuestionPackage> $packages
 */
#[Fillable(['teacher_id', 'type', 'text', 'explanation', 'difficulty'])]
class Question extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * @return HasMany<QuestionOption, $this>
     */
    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class, 'question_id')->orderBy('label');
    }

    /**
     * @return BelongsToMany<QuestionPackage, $this>
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(QuestionPackage::class, 'question_package_items', 'question_id', 'package_id')
            ->withPivot('order')
            ->withTimestamps();
    }
}
