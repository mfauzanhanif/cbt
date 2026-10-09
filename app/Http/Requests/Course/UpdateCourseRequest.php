<?php

declare(strict_types=1);

namespace App\Http\Requests\Course;

use App\Enums\Role;
use App\Models\Course;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Course|null $course */
        $course = $this->route('course');

        return $course !== null && ($this->user()?->can('update', $course) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Course|null $course */
        $course = $this->route('course');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('courses', 'code')->ignore($course?->id),
            ],
            'description' => ['nullable', 'string'],
        ];

        if ($this->user()?->hasRole(Role::Admin->value)) {
            $rules['teacher_id'] = ['required', 'exists:users,id'];
        }

        return $rules;
    }
}
