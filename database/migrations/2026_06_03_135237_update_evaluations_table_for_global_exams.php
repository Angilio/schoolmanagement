<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            if (Schema::hasColumn('evaluations', 'teacher_subject_id')) {
                $table->dropForeign(['teacher_subject_id']);
                $table->dropColumn('teacher_subject_id');
            }

            if (!Schema::hasColumn('evaluations', 'grade_entry_deadline')) {
                $table->date('grade_entry_deadline')
                    ->after('end_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            if (!Schema::hasColumn('evaluations', 'teacher_subject_id')) {
                $table->foreignId('teacher_subject_id')
                    ->nullable()
                    ->after('title')
                    ->constrained('teacher_subjects')
                    ->nullOnDelete();
            }

            if (Schema::hasColumn('evaluations', 'grade_entry_deadline')) {
                $table->dropColumn('grade_entry_deadline');
            }
        });
    }
};