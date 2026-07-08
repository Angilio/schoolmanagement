<?php

use App\Models\Student;
use App\Models\StudentParent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();

            $table->foreignId('parent_id')
                ->constrained('parents')
                ->cascadeOnDelete();

            $table->foreignIdFor(Student::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->string('relationship')->nullable(); 
            // Père, Mère, Tuteur, etc.

            $table->boolean('is_primary')->default(false);

            $table->timestamps();

            $table->unique(['parent_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_student');
    }
};