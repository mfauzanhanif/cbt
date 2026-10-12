<?php

declare(strict_types=1);

namespace App\Http\Requests\QuestionPackage;

use App\Models\QuestionPackage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SyncQuestionsRequest extends FormRequest
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
            'items' => ['present', 'array'],
            'items.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'items.*.order' => ['required', 'integer'],
        ];
    }
}
