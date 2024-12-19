import React, { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

interface Ticker {
  market: string;
  korean_name: string;
  trade_price: number;
  closePrice?: number;
  prevClosePrice?: number;
  closing_price?: number;
  prev_closing_price?: number;
  chgRate?: number;
  acc_trade_price_24h: number;
}

interface BithumbCoinItemBTCProps {
  ticker: Ticker;
  markedCoinBTC: string[];
  setMarkedCoinBTC: (markedCoins: string[]) => void;
  switchColorHandler: (chgRate: number | string) => string;
  localStorageDataBTC: string[];
}

const BithumbCoinItemBTC: React.FC<BithumbCoinItemBTCProps> = ({
  ticker,
  markedCoinBTC,
  setMarkedCoinBTC,
  switchColorHandler,
  localStorageDataBTC,
  favoriteFnActive,
}) => {
  const [isMarked, setIsMarked] = useState<boolean>(false);

  useEffect(() => {
    const confirmMarkedTicker = localStorageDataBTC.filter(
      (ele) => ele === ticker.market
    );
    if (localStorageDataBTC.length > 0 && confirmMarkedTicker.length > 0) {
      setIsMarked(true);
    }
  }, [localStorageDataBTC, ticker.market]);

  const handleMarkedCoin = (): void => {
    if (!isMarked) {
      const marked = [...markedCoinBTC, ticker.market];
      setMarkedCoinBTC(marked);
      localStorage.setItem('isBithumbMarkedCoinBTC', JSON.stringify(marked));
    } else {
      const marked = markedCoinBTC.filter((coin) => coin !== ticker.market);
      setMarkedCoinBTC(marked);
      setIsMarked(false);
      localStorage.setItem('isBithumbMarkedCoinBTC', JSON.stringify(marked));
    }
  };

  const chgPriceHandler = (): number | string => {
    if (ticker.closePrice !== undefined && ticker.prevClosePrice !== undefined) {
      return Math.abs(ticker.closePrice - ticker.prevClosePrice) > 100
        ? ticker.closePrice - ticker.prevClosePrice
        : (ticker.closePrice - ticker.prevClosePrice).toFixed(7);
    } else if (
      ticker.closing_price !== undefined &&
      ticker.prev_closing_price !== undefined
    ) {
      return Math.abs(ticker.closing_price - ticker.prev_closing_price) > 100
        ? ticker.closing_price - ticker.prev_closing_price
        : (ticker.closing_price - ticker.prev_closing_price).toFixed(7);
    }
    return 'N/A';
  };

  const chgRateHandler = (): string => {
    if (ticker.prev_closing_price === 0) {
      return '0';
    } else if (
      ticker.closing_price !== undefined &&
      ticker.prev_closing_price !== undefined
    ) {
      return (
        (
          ((ticker.closing_price - ticker.prev_closing_price) /
            ticker.prev_closing_price) *
          100
        ).toFixed(2) + '%'
      );
    }
    return 'N/A';
  };

  return (
    <tr key={ticker.market}>
      <td className="coinItemsName">
        <section>
          <div>
            <div>{ticker.korean_name}</div>
            <div>
              {ticker.market.split('_')[0] + '/' + ticker.market.split('_')[1]}
            </div>
          </div>
        </section>

        {favoriteFnActive ? (
          <section
            className={
              isMarked ? 'coinItemsMarked markedIcon' : 'coinItemsMarked'
            }
            onClick={handleMarkedCoin}
          >
            {isMarked ? <AiFillStar /> : <FiStar />}
          </section>
        ) : (
          <div></div>
        )}
      </td>

      <td
        className={
          ticker.chgRate
            ? switchColorHandler(ticker.chgRate)
            : switchColorHandler(
                (
                  ((ticker.closing_price! - ticker.prev_closing_price!) /
                    ticker.prev_closing_price!) *
                  100
                ).toFixed(2)
              )
        }
      >
        <div>{ticker.trade_price}</div>
      </td>
      <td
        className={
          ticker.chgRate
            ? switchColorHandler(ticker.chgRate) + ' coinItemsRate'
            : switchColorHandler(
                ((ticker.closing_price! - ticker.prev_closing_price!) /
                  ticker.prev_closing_price!) *
                  100
              ) + ' coinItemsRate'
        }
      >
        <div>{ticker.chgRate ? ticker.chgRate : chgRateHandler()}</div>
        <div>{chgPriceHandler()}</div>
      </td>
      <td className="coinTransactionamount">
        {Number(ticker.acc_trade_price_24h).toFixed(4)}
      </td>
    </tr>
  );
};

export default React.memo(BithumbCoinItemBTC);