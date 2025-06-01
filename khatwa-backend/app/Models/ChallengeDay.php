<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeDay extends Model
{
    use HasFactory;
public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

}
