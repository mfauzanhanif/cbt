<?php

declare(strict_types=1);

namespace App\Http\Requests\Course;

use App\Enums\Role;
use App\Models\Course;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Course::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:courses,code'],
            'description' => ['nullable', 'string'],
        ];

        if ($this->user()?->hasRole(Role::Admin->value)) {
            $rules['teacher_id'] = ['required', 'exists:users,id'];
        }

        return $rules;
    }
}
