<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'name',
        'status',
        'user_id',
        'point'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function todoDetail(){
        return $this->hasOne(TodoDetail::class);
    }
}
