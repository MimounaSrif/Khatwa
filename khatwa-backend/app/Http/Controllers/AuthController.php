<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // 🔹 Enregistrement
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'age' => 'required|integer',
            'pays' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $language = match (strtolower($request->pays)) {
            'maroc', 'france', 'tunisie' => 'fr',
            'usa', 'uk', 'canada' => 'en',
            'algérie', 'égypte', 'maroc' => 'ar',
            default => 'en'
        };

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'age' => $request->age,
            'pays' => $request->pays,
            'language' => $language,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Inscription réussie !',
            'user' => $user,
        ], 201);
    }

    // 🔹 Connexion
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['error' => 'Email ou mot de passe incorrect'], 401);
    }

    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => JWTAuth::factory()->getTTL() * 60,
        'user' => JWTAuth::user()
    ]);
}

    // 🔹 Déconnexion
   public function logout()
{
    try {
        JWTAuth::invalidate(JWTAuth::getToken()); // rend le token inutilisable
        return response()->json(['message' => 'Déconnecté avec succès']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erreur lors de la déconnexion'], 500);
    }
}



    // 🔹 Récupérer le profil
 public function me()
{
    try {
        return response()->json(JWTAuth::parseToken()->authenticate());
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


}
