<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inspection extends Model
{
    protected $fillable = [
        'inspection_code',
        'part_id',
        'user_id',
        'front_status',
        'back_status',
        'final_decision',
        'defect_type',
        'front_image_path',
        'back_image_path',
    ];

    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
