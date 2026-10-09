<?php

declare(strict_types=1);

namespace App\Http\Requests\Exam;

use App\Models\Exam;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Exam|null $exam */
        $exam = $this->route('exam');

        return $exam !== null && ($this->user()?->can('update', $exam) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'package_id' => ['required', 'integer', 'exists:question_packages,id'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:600'],
            'is_active' => ['nullable', 'boolean'],
            'shuffle_questions' => ['nullable', 'boolean'],
            'show_result' => ['nullable', 'boolean'],
        ];
    }
}
