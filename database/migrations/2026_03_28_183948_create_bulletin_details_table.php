<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bulletin_details', function (Blueprint $table) {

            $table->engine = 'InnoDB';

            $table->id();

            $table->foreignId('bulletin_id')
                ->constrained('bulletins')
                ->cascadeOnDelete();

            $table->foreignId('subject_id')
                ->constrained('subjects')
                ->cascadeOnDelete();

            $table->float('average')->nullable();
            $table->integer('coefficient')->default(1);
            $table->text('appreciation')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bulletin_details');
    }
};