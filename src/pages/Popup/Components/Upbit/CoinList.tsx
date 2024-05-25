import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CoinItemBTC from './CoinItemBTC';
import CoinItemKRW from './CoinItemKRW';
import * as Hangul from 'hangul-js';

interface CoinListProps {
  marketDropDownSelected: string;
  makeSort: 'ascending' | 'decending';
  sortElement: string;
  searchCoinName: string;
  favoriteFnActive: boolean;
}

interface Ticker {
  market: string;
  english_name: string;
  korean_name: string;
  [key: string]: any;
}

const CoinList: React.FC<CoinListProps> = ({
  marketDropDownSelected,
  makeSort,
  sortElement,
  searchCoinName,
  favoriteFnActive,
}) => {
  // 로컬 스토리지에서 즐겨찾기 데이터
  const localStorageDataKRW = JSON.parse(
    localStorage.getItem('isMarkedCoinKRW') || '[]'
  );
  const localStorageDataBTC = JSON.parse(
    localStorage.getItem('isMarkedCoinBTC') || '[]'
  );

  const [markedCoinKRW, setMarkedCoinKRW] =
    useState<string[]>(localStorageDataKRW);
  const [markedCoinBTC, setMarkedCoinBTC] =
    useState<string[]>(localStorageDataBTC);
  const [upbitTickersKRW, setUpbitTickersKRW] = useState<Ticker[]>([]);
  const [upbitTickersBTC, setUpbitTickerBTC] = useState<Ticker[]>([]);

  const apiLoading = useSelector((state: any) => state.Coin.apiLoading);
  const upbitTickers = useSelector((state: any) => state.Coin.upbitTickers);

  useEffect(() => {
    // tickers를 필터링하고 정렬하는 함수
    const filterAndSortTickers = (tickers: Ticker[], marketType: string) => {
      const filteredTickers = tickers.filter((ticker) =>
        ticker.market.includes(marketType)
      );

      if (makeSort === 'ascending') {
        filteredTickers.sort((pre, aft) => pre[sortElement] - aft[sortElement]);
      } else if (makeSort === 'decending') {
        filteredTickers.sort((pre, aft) => aft[sortElement] - pre[sortElement]);
      }

      return filteredTickers;
    };

    // 즐겨찾기된 코인을 처리하는 함수
    const handleFavoriteCoins = (tickers: Ticker[], markedCoins: string[]) => {
      const markedArr: Ticker[] = [];
      const remainingArr = tickers.filter((ticker) => {
        if (markedCoins.includes(ticker.market)) {
          markedArr.push(ticker);
          return false;
        }
        return true;
      });
      return [...markedArr, ...remainingArr];
    };

    // KRW와 BTC tickers를 필터링 및 정렬
    let tickersKRW = filterAndSortTickers(Object.values(upbitTickers), 'KRW-');
    let tickersBTC = filterAndSortTickers(Object.values(upbitTickers), 'BTC-');

    // 즐겨찾기된 코인을 우선 처리
    if (favoriteFnActive) {
      tickersKRW = handleFavoriteCoins(tickersKRW, markedCoinKRW);
      tickersBTC = handleFavoriteCoins(tickersBTC, markedCoinBTC);
    }

    // 검색어에 따른 필터링 함수
    const filterBySearchName = (tickers: Ticker[]) =>
      tickers.filter(
        (ticker) =>
          ticker.english_name
            .toLowerCase()
            .includes(searchCoinName.toLowerCase()) ||
          ticker.market
            .replace('/', '')
            .toLowerCase()
            .includes(searchCoinName.toLowerCase()) ||
          Hangul.disassembleToString(ticker.korean_name).includes(
            Hangul.disassembleToString(searchCoinName)
          )
      );

    // 필터링된 ticker들을 상태에 저장
    setUpbitTickersKRW(filterBySearchName(tickersKRW));
    setUpbitTickerBTC(filterBySearchName(tickersBTC));
  }, [
    upbitTickers,
    makeSort,
    sortElement,
    searchCoinName,
    markedCoinKRW,
    markedCoinBTC,
    favoriteFnActive,
  ]);

  // 가격 변동에 따른 색상 설정 함수
  const switchColorHandler = (current: string): string =>
    ({
      RISE: 'fontColorRise',
      FALL: 'fontColorFall',
      EVEN: 'fontColorEven',
    }[current] || '');

  // 가격 변동에 따른 기호 설정 함수
  const switchPriceOpeatorHandler = (current: string): string =>
    ({
      RISE: '+',
      FALL: '',
      EVEN: '',
    }[current] || '');

  return (
    <tbody>
      {/* API 로딩 상태와 선택된 시장에 따른 조건부 렌더링 */}
      {!apiLoading && marketDropDownSelected === 'KRW'
        ? upbitTickersKRW.map((ticker) => (
            <CoinItemKRW
              key={ticker.market}
              ticker={ticker}
              switchColorHandler={switchColorHandler}
              switchPriceOpeatorHandler={switchPriceOpeatorHandler}
              markedCoinKRW={markedCoinKRW}
              setMarkedCoinKRW={setMarkedCoinKRW}
              localStorageDataKRW={localStorageDataKRW}
              favoriteFnActive={favoriteFnActive}
            />
          ))
        : upbitTickersBTC.map((ticker) => (
            <CoinItemBTC
              key={ticker.market}
              ticker={ticker}
              switchColorHandler={switchColorHandler}
              switchPriceOpeatorHandler={switchPriceOpeatorHandler}
              markedCoinBTC={markedCoinBTC}
              setMarkedCoinBTC={setMarkedCoinBTC}
              localStorageDataBTC={localStorageDataBTC}
              favoriteFnActive={favoriteFnActive}
            />
          ))}
    </tbody>
  );
};

export default React.memo(CoinList);
