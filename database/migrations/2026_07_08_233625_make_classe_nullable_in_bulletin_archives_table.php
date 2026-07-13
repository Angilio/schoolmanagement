<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bulletin_archives', function (Blueprint $table) {
            $table->unsignedBigInteger('classe_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('bulletin_archives', function (Blueprint $table) {
            $table->unsignedBigInteger('classe_id')->nullable(false)->change();
        });
    }
};