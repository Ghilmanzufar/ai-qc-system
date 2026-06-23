<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    // Ini untuk tabel parts
    protected $fillable = ['product_model_id', 'part_no', 'part_name', 'ai_model_file'];
}