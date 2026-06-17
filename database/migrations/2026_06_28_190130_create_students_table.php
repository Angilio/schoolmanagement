<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {

            $table->engine = 'InnoDB';

            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Classe : Seconde, Première, Terminale...
            $table->foreignId('classe_id')
                ->constrained('classes')
                ->cascadeOnDelete();

            // Série : A, C, D...
            // nullable car Seconde n'a pas de série
            $table->foreignId('serie_id')
                ->nullable()
                ->constrained('series')
                ->nullOnDelete();

            // Section : I, II, III...
            $table->foreignId('section_id')
                ->nullable()
                ->constrained('sections')
                ->nullOnDelete();

            $table->string('matricule')->unique();

            $table->date('birthdate')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};