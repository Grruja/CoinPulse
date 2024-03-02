<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoinFiatMetrics extends Model
{
    protected $table = 'coin_fiat_metrics';

    protected $fillable = [
        'coin_id',
        'fiat_currency_id',
        'current_price',
        'market_cap',
        'total_volume',
        'ath',
        'price_change_percentage_24h',
        'price_change_percentage_7d',
        'price_change_percentage_30d',
    ];
}