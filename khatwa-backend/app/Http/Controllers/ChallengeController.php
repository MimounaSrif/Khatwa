<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeDay;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'duration' => 'required|in:30,60,90',
        'difficulty' => 'required|in:facile,moyenne,forte',
        'days' => 'required|array',
        'days.*.day_number' => 'required|integer|min:1',
        'days.*.content' => 'required|string',
    ]);

    $challenge = Challenge::create([
        'title' => $request->title,
        'description' => $request->description,
        'duration' => $request->duration,
        'difficulty' => $request->difficulty,
    ]);

    foreach ($request->days as $day) {
        $challenge->days()->create([
            'day_number' => $day['day_number'],
            'content' => $day['content'],
        ]);
    }

    return response()->json([
        'message' => 'Challenge créé avec succès',
        'challenge' => $challenge->load('days'),
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Challenge $challenge)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Challenge $challenge)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Challenge $challenge)
    {
        //
    }
}
