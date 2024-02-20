<?php

namespace App\Console\Commands;

use App\Models\ExchangeRate;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UpdateExchangeRates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exchange-rates:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update exchange rates in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Http::get('https://api.currencyapi.com/v3/latest', [
            'apikey' => env('EXCHANGE_RATES_API_KEY'),
            'currencies' => implode(',', config('supportedCurrencies')),
        ]);

        $currencies = $response->json();

        foreach ($currencies['data'] as $currency) {
            ExchangeRate::updateOrCreate([
                'currency_code' => $currency['code'],
                'rate' => $currency['value'],
            ]);
        }
    }
}
