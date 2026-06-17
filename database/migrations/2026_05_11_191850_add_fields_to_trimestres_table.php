<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('trimestres', function (Blueprint $table) {

            $table->foreignId('school_year_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('start_date')
                ->nullable()
                ->after('name');

            $table->date('end_date')
                ->nullable()
                ->after('start_date');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trimestres', function (Blueprint $table) {

            $table->dropForeign(['school_year_id']);

            $table->dropColumn([
                'school_year_id',
                'start_date',
                'end_date'
            ]);

        });
    }
};