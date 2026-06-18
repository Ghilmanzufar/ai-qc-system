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
        Schema::create('master_parts', function (Blueprint $table) {
            $table->id();
            $table->string('model_name');      // cth: Alpha X1
            $table->string('part_name');       // cth: Housing Block
            $table->string('part_number')->unique(); // cth: PN-8842-A
            $table->string('yolo_weights_file')->nullable(); // cth: best_rotor_v2.pt
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_parts');
    }
};
