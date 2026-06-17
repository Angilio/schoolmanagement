<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Supprimer l'ancienne contrainte unique evaluation_id + student_id
        |--------------------------------------------------------------------------
        */
        try {
            Schema::table('note_details', function (Blueprint $table) {
                $table->dropUnique('note_details_evaluation_id_student_id_unique');
            });
        } catch (\Throwable $e) {
            // Si la contrainte n'existe pas, on continue.
        }

        Schema::table('note_details', function (Blueprint $table) {
            if (!Schema::hasColumn('note_details', 'teacher_subject_id')) {
                $table->foreignId('teacher_subject_id')
                    ->after('evaluation_id')
                    ->constrained('teacher_subjects')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('note_details', 'coefficient')) {
                $table->unsignedInteger('coefficient')
                    ->default(1)
                    ->after('note');
            }

            if (!Schema::hasColumn('note_details', 'weighted_note')) {
                $table->decimal('weighted_note', 8, 2)
                    ->default(0)
                    ->after('coefficient');
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Nouvelle contrainte unique
        |--------------------------------------------------------------------------
        | Un élève ne peut avoir qu'une seule note pour :
        | évaluation + matière/classe/section + élève.
        */
        try {
            Schema::table('note_details', function (Blueprint $table) {
                $table->unique(
                    ['evaluation_id', 'teacher_subject_id', 'student_id'],
                    'note_details_eval_teacher_student_unique'
                );
            });
        } catch (\Throwable $e) {
            // Si elle existe déjà, on continue.
        }
    }

    public function down(): void
    {
        try {
            Schema::table('note_details', function (Blueprint $table) {
                $table->dropUnique('note_details_eval_teacher_student_unique');
            });
        } catch (\Throwable $e) {
            // Si la contrainte n'existe pas, on continue.
        }

        Schema::table('note_details', function (Blueprint $table) {
            if (Schema::hasColumn('note_details', 'teacher_subject_id')) {
                $table->dropForeign(['teacher_subject_id']);
                $table->dropColumn('teacher_subject_id');
            }

            if (Schema::hasColumn('note_details', 'weighted_note')) {
                $table->dropColumn('weighted_note');
            }

            if (Schema::hasColumn('note_details', 'coefficient')) {
                $table->dropColumn('coefficient');
            }
        });

        try {
            Schema::table('note_details', function (Blueprint $table) {
                $table->unique(
                    ['evaluation_id', 'student_id'],
                    'note_details_evaluation_id_student_id_unique'
                );
            });
        } catch (\Throwable $e) {
            //
        }
    }
};