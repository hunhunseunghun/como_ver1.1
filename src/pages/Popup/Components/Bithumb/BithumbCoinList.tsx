import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BithumbCoinItemBTC from './BithumbCoinItemBTC';
import BithumbCoinItemKRW from './BithumbCoinItemKRW';
import * as Hangul from 'hangul-js';

interface BithumbCoinListProps {
  marketDropDownSelected: string;
  makeSort: 'ascending' | 'decending';
  sortElement: string;
  searchCoinName: string;
  favoriteFnActive: boolean;
}

interface Ticker {
  market: string;
  korean_name: string;
  closePrice?: number;
  closing_price?: number;
  chgRate?: number;
  prev_closing_price?: number;
  acc_trade_value_24H: number;
  trade_price?: number;
  change_rate?: number;
  acc_trade_price_24h?: number;
}

const BithumbCoinList: React.FC<BithumbCoinListProps> = ({
  marketDropDownSelected,
  makeSort,
  sortElement,
  searchCoinName,
  favoriteFnActive,
}) => {
  // 로컬 스토리지에서 즐겨찾기 데이터
  const localStorageDataKRW: string[] = JSON.parse(
    localStorage.getItem('isBithumbMarkedCoinKRW') || '[]'
  );
  const localStorageDataBTC: string[] = JSON.parse(
    localStorage.getItem('isBithumbMarkedCoinBTC') || '[]'
  );

  // 상태 정의
  const [markedCoinKRW, setMarkedCoinKRW] =
    useState<string[]>(localStorageDataKRW);
  const [markedCoinBTC, setMarkedCoinBTC] =
    useState<string[]>(localStorageDataBTC);
  const [bithumbTickersKRW, setBithumbTickersKRW] = useState<Ticker[]>([]);
  const [bithumbTickersBTC, setBithumbTickersBTC] = useState<Ticker[]>([]);
  const tickers = useSelector((state: any) => state.Coin.bithumbTickers);

  useEffect(() => {
    // 티커를 필터링하고 정렬하는 함수
    const processTickers = (tickers: Ticker[], marketType: string) => {
      const filteredTickers = tickers
        .filter((ticker) => ticker.market.includes(marketType))
        .map((ticker) => ({
          ...ticker,
          trade_price: ticker.closePrice || ticker.closing_price,
          change_rate:
            ticker.chgRate ||
            ((ticker.closing_price! - ticker.prev_closing_price!) /
              ticker.prev_closing_price!) *
              100,
          acc_trade_price_24h: ticker.acc_trade_value_24H,
        }));

      return filteredTickers.sort((pre, aft) =>
        makeSort === 'ascending'
          ? pre[sortElement] - aft[sortElement]
          : aft[sortElement] - pre[sortElement]
      );
    };

    let tickersKRW = processTickers(Object.values(tickers), '_KRW');
    let tickersBTC = processTickers(Object.values(tickers), '_BTC');

    // 즐겨찾기된 코인을 우선 처리하는 함수
    const prioritizeFavorites = (tickers: Ticker[], favorites: string[]) => {
      const favoritesArr = tickers.filter((ticker) =>
        favorites.includes(ticker.market)
      );
      const remainingArr = tickers.filter(
        (ticker) => !favorites.includes(ticker.market)
      );
      return [...favoritesArr, ...remainingArr];
    };

    if (favoriteFnActive) {
      tickersKRW = prioritizeFavorites(tickersKRW, markedCoinKRW);
      tickersBTC = prioritizeFavorites(tickersBTC, markedCoinBTC);
    }

    // 코인 이름으로 필터링하는 함수
    const filterBySearchName = (tickers: Ticker[]) =>
      tickers.filter(
        (ticker) =>
          ticker.market
            .replace('_', '')
            .toLowerCase()
            .includes(searchCoinName.toLowerCase()) ||
          Hangul.disassembleToString(ticker.korean_name).includes(
            Hangul.disassembleToString(searchCoinName)
          )
      );

    setBithumbTickersKRW(filterBySearchName(tickersKRW));
    setBithumbTickersBTC(filterBySearchName(tickersBTC));
  }, [
    tickers,
    makeSort,
    sortElement,
    searchCoinName,
    markedCoinKRW,
    markedCoinBTC,
    favoriteFnActive,
  ]);

  // 가격 변동에 따른 색상 설정 함수
  const switchColorHandler = (current: number): string => {
    if (current > 0) return 'fontColorRise';
    if (current < 0) return 'fontColorFall';
    return 'fontColorEven';
  };

  return (
    <tbody>
      {marketDropDownSelected === 'KRW'
        ? bithumbTickersKRW.map((ticker) => (
            <BithumbCoinItemKRW
              key={ticker.market}
              ticker={ticker}
              markedCoinKRW={markedCoinKRW}
              setMarkedCoinKRW={setMarkedCoinKRW}
              switchColorHandler={switchColorHandler}
              localStorageDataKRW={localStorageDataKRW}
              favoriteFnActive={favoriteFnActive}
            />
          ))
        : bithumbTickersBTC.map((ticker) => (
            <BithumbCoinItemBTC
              key={ticker.market}
              ticker={ticker}
              markedCoinBTC={markedCoinBTC}
              setMarkedCoinBTC={setMarkedCoinBTC}
              switchColorHandler={switchColorHandler}
              localStorageDataBTC={localStorageDataBTC}
              favoriteFnActive={favoriteFnActive}
            />
          ))}
    </tbody>
  );
};

export default React.memo(BithumbCoinList);
