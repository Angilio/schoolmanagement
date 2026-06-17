<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();

            $table->string('title'); // ex: Examen 1er trimestre

            $table->foreignId('trimestre_id')
                ->constrained('trimestres')
                ->cascadeOnDelete();

            $table->date('start_date'); // date de début
            $table->date('end_date');   // date limite de saisie des notes

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};