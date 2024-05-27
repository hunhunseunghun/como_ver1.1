import React, { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

// Props 타입 정의
interface CoinItemBTCProps {
  ticker: Ticker;
  switchColorHandler: (change: number) => string;
  switchPriceOpeatorHandler: (change: number) => string;
  markedCoinBTC: string[];
  setMarkedCoinBTC: React.Dispatch<React.SetStateAction<string[]>>;
  localStorageDataBTC: string[];
  favoriteFnActive: boolean;
}

// Ticker 타입 정의
interface Ticker {
  market: string;
  korean_name: string;
  trade_price: number;
  change: number;
  change_rate: number;
  change_price: number;
  acc_trade_price_24h: number;
}

const CoinItemBTC: React.FC<CoinItemBTCProps> = ({
  ticker,
  switchColorHandler,
  switchPriceOpeatorHandler,
  markedCoinBTC,
  setMarkedCoinBTC,
  localStorageDataBTC,
  favoriteFnActive,
}) => {
  const [isMarked, setIsMarked] = useState<boolean>(
    localStorageDataBTC.includes(ticker.market)
  );

  useEffect(() => {
    // 로컬스토리지 즐겨찾기 배열 데이터에서 해당 요소 확인 (마켓이름 사용)
    if (localStorageDataBTC.includes(ticker.market)) {
      setIsMarked(true);
    }
  }, [localStorageDataBTC, ticker.market]);

  const handleMarkedCoin = () => {
    const updatedMarkedCoinBTC = isMarked
      ? markedCoinBTC.filter((market) => market !== ticker.market)
      : [...markedCoinBTC, ticker.market];

    setMarkedCoinBTC(updatedMarkedCoinBTC);
    setIsMarked(!isMarked);
    localStorage.setItem(
      'isMarkedCoinBTC',
      JSON.stringify(updatedMarkedCoinBTC)
    ); // 즐겨찾기 데이터 로컬스토리지 사용(새로고침해도 유지)
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
      <td className={switchColorHandler(ticker.change)}>
        <div>{ticker.trade_price.toFixed(8)}</div>
      </td>
      <td className={switchColorHandler(ticker.change) + ' coinItemsRate'}>
        <div>
          {switchPriceOpeatorHandler(ticker.change)}
          {(ticker.change_rate * 100).toFixed(2) + '%'}
        </div>
        <div>
          {switchPriceOpeatorHandler(ticker.change)}
          {ticker.change_price.toFixed(8)}
        </div>
      </td>
      <td>
        <div className="coinTransactionamount">
          {ticker.acc_trade_price_24h.toFixed(4)}
          {' BTC'}
        </div>
      </td>
    </tr>
  );
};

export default React.memo(CoinItemBTC);
