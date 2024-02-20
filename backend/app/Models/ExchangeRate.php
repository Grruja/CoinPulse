<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    // Base currency for exchange rates is USD.

    protected $table = 'exchange_rates';

    protected $fillable = [
        'currency_code',
        'rate',
    ];
}
