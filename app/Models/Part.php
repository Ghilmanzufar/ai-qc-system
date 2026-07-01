<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    // Ini untuk tabel parts
    protected $fillable = ['product_model_id', 'part_no', 'part_name', 'ai_model_file', 'master_image_file'];

    protected $appends = ['master_image_url'];

    public function productModel()
    {
        return $this->belongsTo(ProductModel::class);
    }

    public function getMasterImageUrlAttribute()
    {
        if ($this->master_image_file) {
            return asset('images/masters/' . $this->master_image_file);
        }
        return null;
    }
}