<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('bulletin_archives')) {
            Schema::create('bulletin_archives', function (Blueprint $table) {
                $table->id();

                $table->foreignId('school_year_id')
                    ->constrained('school_years')
                    ->cascadeOnDelete();

                $table->foreignId('classe_id')
                    ->nullable()
                    ->constrained('classes')
                    ->nullOnDelete();

                $table->foreignId('section_id')
                    ->nullable()
                    ->constrained('sections')
                    ->nullOnDelete();

                $table->foreignId('serie_id')
                    ->nullable()
                    ->constrained('series')
                    ->nullOnDelete();

                $table->string('file_path');
                $table->json('filters')->nullable();

                $table->foreignId('generated_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                $table->timestamp('generated_at')->nullable();

                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('bulletin_archives');
    }
};