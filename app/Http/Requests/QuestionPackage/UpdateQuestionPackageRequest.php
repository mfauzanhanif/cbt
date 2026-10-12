<?php

declare(strict_types=1);

namespace App\Http\Requests\QuestionPackage;

use App\Models\QuestionPackage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var QuestionPackage|null $package */
        $package = $this->route('package');

        return $package !== null && ($this->user()?->can('update', $package) ?? false);
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
