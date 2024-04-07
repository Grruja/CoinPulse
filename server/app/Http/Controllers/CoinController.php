<?php

namespace App\Http\Controllers;

use App\Http\Helpers\CoinHelper;
use App\Http\Requests\GetCoinListRequest;
use App\Models\Coin;
use App\Repository\CoinMarketDataRepo;
use App\Repository\CoinRepo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class CoinController extends Controller
{
    private CoinRepo $coinRepo;
    private CoinMarketDataRepo $coinMarketDataRepo;

    public function __construct()
    {
        $this->coinRepo = new CoinRepo();
        $this->coinMarketDataRepo = new CoinMarketDataRepo();
    }

    public function coinList(GetCoinListRequest $request): JsonResponse
    {
        $page = $request->get('page');
        $currencyCode = $request->get('currency');

        $apiPage = CoinHelper::convertRequestPageToApiPage($page);
        $coinsFromApiPage = $this->coinRepo->getCoinListInCurrency($currencyCode, $apiPage, config('api.coin_gecko.coins_per_page'));
        $isCoinListUpdated = $this->coinMarketDataRepo->isCoinListDataUpdated($coinsFromApiPage);

        if (!$isCoinListUpdated) {
            Artisan::call('coin-list:update', ['page' => $page, 'currencyCode' => $currencyCode]);
        }

        $coins = $this->coinRepo->getCoinListInCurrency($currencyCode, $page, config('api.coin_pulse.coins_per_page'));
        return response()->json($coins);
    }

    public function singleCoinPage(Coin $coin): JsonResponse
    {
        $isCoinUpdated = $this->coinMarketDataRepo->isCoinUpdatedInAllCurrencies($coin->id);
        if (!$isCoinUpdated) Artisan::call('single-coin:update', ['coinId' => $coin->id]);

        $coinData = $coin->with('coinMarketData')->firstWhere('id', $coin->id);
        $coinDataReformated = CoinHelper::reformatSingleCoinInstanceModel($coinData);
        return response()->json($coinDataReformated);
    }
}
