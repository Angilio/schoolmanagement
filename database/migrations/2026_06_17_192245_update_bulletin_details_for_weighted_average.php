<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function indexExists(string $table, string $indexName): bool
    {
        $indexes = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [
            $indexName,
        ]);

        return count($indexes) > 0;
    }

    public function up(): void
    {
        if (!Schema::hasColumn('bulletin_details', 'weighted_average')) {
            Schema::table('bulletin_details', function (Blueprint $table) {
                $table->decimal('weighted_average', 8, 2)
                    ->default(0)
                    ->after('coefficient');
            });
        }

        if (!$this->indexExists('bulletin_details', 'bulletin_details_bulletin_subject_unique')) {
            Schema::table('bulletin_details', function (Blueprint $table) {
                $table->unique(
                    ['bulletin_id', 'subject_id'],
                    'bulletin_details_bulletin_subject_unique'
                );
            });
        }

        if (!$this->indexExists('bulletins', 'bulletins_student_trimester_year_unique')) {
            Schema::table('bulletins', function (Blueprint $table) {
                $table->unique(
                    ['student_id', 'trimestre_id', 'school_year_id'],
                    'bulletins_student_trimester_year_unique'
                );
            });
        }
    }

    public function down(): void
    {
        if ($this->indexExists('bulletin_details', 'bulletin_details_bulletin_subject_unique')) {
            Schema::table('bulletin_details', function (Blueprint $table) {
                $table->dropUnique('bulletin_details_bulletin_subject_unique');
            });
        }

        if (Schema::hasColumn('bulletin_details', 'weighted_average')) {
            Schema::table('bulletin_details', function (Blueprint $table) {
                $table->dropColumn('weighted_average');
            });
        }

        if ($this->indexExists('bulletins', 'bulletins_student_trimester_year_unique')) {
            Schema::table('bulletins', function (Blueprint $table) {
                $table->dropUnique('bulletins_student_trimester_year_unique');
            });
        }
    }
};