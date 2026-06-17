<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('evaluation_types');
    }

    public function down(): void
    {
        Schema::create('evaluation_types', function (Blueprint $table) {

            $table->id();
            $table->string('name');
            $table->float('weight')->default(1);
            $table->timestamps();
        });
    }
};