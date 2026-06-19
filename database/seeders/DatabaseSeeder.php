<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductModel;
use App\Models\Part;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat Model 1
        $model1 = ProductModel::create(['name' => 'Motor Alpha X1']);
        Part::create(['product_model_id' => $model1->id, 'part_no' => 'PN-8842-A', 'part_name' => 'Housing Block']);
        Part::create(['product_model_id' => $model1->id, 'part_no' => 'PN-4421-T', 'part_name' => 'Titanium Flange']);

        // Buat Model 2
        $model2 = ProductModel::create(['name' => 'Mesin Beta V2']);
        Part::create(['product_model_id' => $model2->id, 'part_no' => 'PN-9910-C', 'part_name' => 'Stator QC']);
        Part::create(['product_model_id' => $model2->id, 'part_no' => 'PN-1102-X', 'part_name' => 'Bearing Cap']);
    }
}