<?php

declare(strict_types=1);

namespace App\Http\Requests\Question;

use App\Models\Question;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Question::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'text' => ['required', 'string'],
            'difficulty' => ['nullable', 'string', 'in:mudah,sedang,sulit'],
            'explanation' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.label' => ['required', 'string', 'max:10'],
            'options.*.text' => ['required', 'string'],
            'options.*.is_correct' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator): void {
            $options = $this->input('options', []);
            $hasCorrect = false;

            if (is_array($options)) {
                foreach ($options as $opt) {
                    if (! empty($opt['is_correct'])) {
                        $hasCorrect = true;
                        break;
                    }
                }
            }

            if (! $hasCorrect) {
                $validator->errors()->add('options', 'Minimal satu pilihan jawaban harus ditandai sebagai jawaban benar.');
            }
        });
    }
}
