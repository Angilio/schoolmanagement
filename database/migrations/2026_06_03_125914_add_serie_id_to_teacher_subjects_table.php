<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teacher_subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('teacher_subjects', 'serie_id')) {
                $table->foreignId('serie_id')
                    ->nullable()
                    ->after('classe_id')
                    ->constrained('series')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('teacher_subjects', function (Blueprint $table) {
            if (Schema::hasColumn('teacher_subjects', 'serie_id')) {
                $table->dropForeign(['serie_id']);
                $table->dropColumn('serie_id');
            }
        });
    }
};