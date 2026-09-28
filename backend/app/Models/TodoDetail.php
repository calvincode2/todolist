<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TodoDetail extends Model
{
    protected $fillable = [
        'description',
        'todo_id',
        'comment'
    ];

    public function todo(){
        return $this->belongsTo(Todo::class);
    }
}
