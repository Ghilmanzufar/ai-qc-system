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
        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->string('inspection_code')->unique();
            
            // Relasi
            $table->foreignId('part_id')->constrained('master_parts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Status Inspeksi
            $table->enum('front_status', ['OK', 'DEFECT']);
            $table->enum('back_status', ['OK', 'DEFECT']);
            $table->enum('final_decision', ['PASS', 'REJECT']);
            
            // Lokasi Simpan Gambar
            $table->string('front_image_path')->nullable();
            $table->string('back_image_path')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
