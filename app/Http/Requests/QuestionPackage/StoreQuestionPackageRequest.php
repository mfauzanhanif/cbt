<?php

declare(strict_types=1);

namespace App\Http\Requests\QuestionPackage;

use App\Models\QuestionPackage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', QuestionPackage::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
