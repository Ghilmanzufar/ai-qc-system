<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProductModel;
use App\Models\Part;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users (Admin, Supervisor, Operator)
        User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@aiqc.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Pak Supervisor',
            'email' => 'supervisor@aiqc.com',
            'password' => Hash::make('password'),
            'role' => 'supervisor',
        ]);

        User::create([
            'name' => 'Operator Line 1',
            'email' => 'operator1@aiqc.com',
            'password' => Hash::make('password'),
            'role' => 'operator',
        ]);

        // 2. Create Dummy Product Models
        $model1 = ProductModel::create([
            'name' => 'Kipas Angin Elektrik',
        ]);

        $model2 = ProductModel::create([
            'name' => 'Botol Minum Plastik',
        ]);

        // 3. Create Parts mapped to AI Models
        Part::create([
            'product_model_id' => $model1->id,
            'part_no' => 'KP-001',
            'part_name' => 'Baling-Baling',
            'ai_model_file' => 'yolo26n.pt',
        ]);

        Part::create([
            'product_model_id' => $model1->id,
            'part_no' => 'KP-002',
            'part_name' => 'Dinamo Tengah',
            'ai_model_file' => 'best.pt',
        ]);

        Part::create([
            'product_model_id' => $model2->id,
            'part_no' => 'BT-001',
            'part_name' => 'Tutup Botol',
            'ai_model_file' => 'yolo26n.pt',
        ]);
    }
}