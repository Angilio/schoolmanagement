<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function indexExists(string $table, string $indexName): bool
    {
        $indexes = DB::select("SHOW INDEX FROM {$table} WHERE Key_name = ?", [
            $indexName,
        ]);

        return count($indexes) > 0;
    }

    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Supprimer l'ancienne contrainte unique
        |--------------------------------------------------------------------------
        | Ancienne logique :
        | evaluation_id + student_id
        |
        | Problème :
        | Un élève ne pouvait avoir qu'une seule note par évaluation,
        | même pour plusieurs matières.
        */
        if ($this->indexExists('note_details', 'note_details_evaluation_id_student_id_unique')) {
            Schema::table('note_details', function (Blueprint $table) {
                $table->dropUnique('note_details_evaluation_id_student_id_unique');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Ajouter la nouvelle contrainte unique
        |--------------------------------------------------------------------------
        | Nouvelle logique :
        | evaluation_id + teacher_subject_id + student_id
        |
        | Cela permet à un élève d'avoir plusieurs notes dans une même évaluation,
        | mais une seule note par matière/affectation.
        */
        if (!$this->indexExists('note_details', 'note_details_eval_teacher_student_unique')) {
            Schema::table('note_details', function (Blueprint $table) {
                $table->unique(
                    ['evaluation_id', 'teacher_subject_id', 'student_id'],
                    'note_details_eval_teacher_student_unique'
                );
            });
        }
    }

    public function down(): void
    {
        if ($this->indexExists('note_details', 'note_details_eval_teacher_student_unique')) {
            Schema::table('note_details', function (Blueprint $table) {
                $table->dropUnique('note_details_eval_teacher_student_unique');
            });
        }

        if (!$this->indexExists('note_details', 'note_details_evaluation_id_student_id_unique')) {
            Schema::table('note_details', function (Blueprint $table) {
                $table->unique(
                    ['evaluation_id', 'student_id'],
                    'note_details_evaluation_id_student_id_unique'
                );
            });
        }
    }
};