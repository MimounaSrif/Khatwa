<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('challenge_days', function (Blueprint $table) {
        $table->id();
        $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
        $table->integer('jour'); // numéro du jour (1 à 30/60/90)
        $table->text('titre');   // titre de la tâche du jour
        $table->text('contenu'); // explication ou consigne
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenge_days');
    }
};
