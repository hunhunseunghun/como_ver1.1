import React, { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

interface CoinItemKRWProps {
  ticker: Ticker;
  switchColorHandler: (change: number) => string;
  switchPriceOpeatorHandler: (change: number) => string;
  markedCoinKRW: string[];
  setMarkedCoinKRW: React.Dispatch<React.SetStateAction<string[]>>;
  localStorageDataKRW: string[];
  favoriteFnActive: boolean;
}

interface Ticker {
  market: string;
  korean_name: string;
  trade_price: number;
  change: number;
  change_rate: number;
  change_price: number;
  acc_trade_price_24h: number;
}

const CoinItemKRW: React.FC<CoinItemKRWProps> = ({
  ticker,
  switchColorHandler,
  switchPriceOpeatorHandler,
  markedCoinKRW,
  setMarkedCoinKRW,
  localStorageDataKRW,
  favoriteFnActive,
}) => {
  const [isMarked, setIsMarked] = useState<boolean>(
    localStorageDataKRW.includes(ticker.market)
  );

  const handleMarkedCoin = () => {
    // 즐겨찾기 배열 데이터 추가, 삭제
    const updatedMarkedCoinKRW = isMarked
      ? markedCoinKRW.filter((market) => market !== ticker.market)
      : [...markedCoinKRW, ticker.market];

    setMarkedCoinKRW(updatedMarkedCoinKRW);
    setIsMarked(!isMarked);
    localStorage.setItem(
      'isMarkedCoinKRW',
      JSON.stringify(updatedMarkedCoinKRW)
    ); // 즐겨찾기 데이터 로컬스토리지 사용
  };

  return (
    <tr>
      <td className="coinItemsName">
        <section>
          <img
            src={`https://static.upbit.com/logos/${
              ticker.market.split('-')[1]
            }.png`}
            alt={ticker.korean_name}
          />
          <div>
            <div>{ticker.korean_name}</div>
            {/* TODO: 코인 네임 클릭시, link 리다이렉션 필요 */}
            <div>
              {ticker.market.replace('-', '').substring(3, 6) +
                '/' +
                ticker.market.replace('-', '').substring(0, 3)}
            </div>
          </div>
        </section>
        {favoriteFnActive && (
          <section
            className={
              isMarked ? 'coinItemsMarked markedIcon' : 'coinItemsMarked'
            }
            onClick={handleMarkedCoin}
          >
            {isMarked ? <AiFillStar /> : <FiStar />}
          </section>
        )}
      </td>
      <td className={`${switchColorHandler(ticker.change)}`}>
        <div className="coinItemsPrice">
          {ticker.trade_price.toLocaleString()}
        </div>
      </td>
      <td className={switchColorHandler(ticker.change) + ' coinItemsRate'}>
        <div>
          {switchPriceOpeatorHandler(ticker.change)}
          {(ticker.change_rate * 100).toFixed(2) + '%'}
        </div>
        <div>
          {switchPriceOpeatorHandler(ticker.change)}
          {ticker.change_price.toLocaleString()}
        </div>
      </td>
      <td>
        <div className="coinTransactionamount">
          {(ticker.acc_trade_price_24h / 1000000)
            .toFixed()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          {' 백만'}
        </div>
      </td>
    </tr>
  );
};

export default React.memo(CoinItemKRW);
