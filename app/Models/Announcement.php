<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'body',
        'type',
        'target_role',
        'is_active',
        'created_by',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
    ];

    /**
     * Scope: hanya pengumuman yang aktif & belum kedaluwarsa.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Relasi: dibuat oleh siapa.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi: daftar user yang sudah membaca.
     */
    public function reads()
    {
        return $this->hasMany(AnnouncementRead::class);
    }

    /**
     * Cek apakah user tertentu sudah membaca.
     */
    public function isReadBy($userId): bool
    {
        return $this->reads()->where('user_id', $userId)->exists();
    }
}
