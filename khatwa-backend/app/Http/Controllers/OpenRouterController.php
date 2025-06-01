<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OpenRouterController extends Controller
{
    public function ask(Request $request)
    {
        $userMessage = $request->input('message');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('fb53bd46731047579d096ab4373428f4'),
            'HTTP-Referer' => 'http://localhost', // ou ton domaine
            'X-Title' => 'khatwa-dev-assistant'
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'openrouter/auto', // Ou 'openchat', 'meta-llama', etc.
             'messages' => [
                ['role' => 'system', 'content' => 'Tu es un coach de développement personnel. Aide l’utilisateur à créer un challenge.'],
                ['role' => 'user', 'content' => 'Je veux devenir plus discipliné. Que me proposes-tu ?'],
            ],
        ]);
        $data = $response->json();
        return response()->json([
            'reply' => $data['choices'][0]['message']['content'] ?? 'Réponse non disponible'
        ]);
    }
}
