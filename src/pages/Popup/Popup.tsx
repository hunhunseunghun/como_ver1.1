import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startInit, startBithumb } from './Reducer/coinReducer';
import './Popup.css';

import CoinList from './Components/Upbit/CoinList';
import ExchangerDropdown from './Components/Common/Dropdown/ExchangerDropdown';
import MarketDropDown from './Components/Common/Dropdown/MarketDropDown';
import BithumbCoinList from './Components/Bithumb/BithumbCoinList';

import { FaSistrix } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import {
  CgArrowDownR,
  CgArrowUpR,
  CgArrowLeftR,
  CgArrowRightR,
} from 'react-icons/cg';
import defaultcomologo from '../../assets/img/defaultcomologo.png';

type SortOrder = 'ascending' | 'descending';
type Currency = '업비트' | '빗썸';
type Market = 'KRW' | 'BTC';

interface State {
  sortOrder: SortOrder;
  sortField: string;
  selectedCurrency: Currency;
  selectedMarket: Market;
  searchTerm: string;
  isWideX: boolean;
  isWideY: boolean;
  isFavoritesActive: boolean;
}

const Popup: React.FC = () => {
  const dispatch = useDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<State>({
    sortOrder: 'descending',
    sortField: 'trade_price',
    selectedCurrency:
      (localStorage.getItem('como_lastest_currency') as Currency) || '업비트',
    selectedMarket: 'KRW',
    searchTerm: '',
    isWideX: localStorage.getItem('como_lastest_xwide') === 'true',
    isWideY: localStorage.getItem('como_lastest_ywide') === 'true',
    isFavoritesActive: true,
  });

  useEffect(() => {
    dispatch(startInit());
    dispatch(startBithumb());
  }, [dispatch]);

  const toggleWideMode = (axis: 'X' | 'Y') => {
    const key = axis === 'X' ? 'como_lastest_xwide' : 'como_lastest_ywide';
    setState((prev) => {
      const isWide = axis === 'X' ? prev.isWideX : prev.isWideY;
      localStorage.setItem(key, String(!isWide));
      return { ...prev, [axis === 'X' ? 'isWideX' : 'isWideY']: !isWide };
    });
  };

  const toggleSortField = (field: string) => {
    setState((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortOrder === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const updateState = (key: keyof State, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="App">
      <nav>
        <section className="nav_top_section">
          <img src={defaultcomologo} alt="logo" />
          <section>
            <button
              className={`favorites_btn ${
                state.isFavoritesActive
                  ? 'favorites_fn_active'
                  : 'favorites_fn_inactive'
              }`}
              onClick={() =>
                updateState('isFavoritesActive', !state.isFavoritesActive)
              }
              title={`즐겨찾기 ${
                state.isFavoritesActive ? '비활성화' : '활성화'
              }`}
            >
              {state.isFavoritesActive ? <AiFillStar /> : <FiStar />}
            </button>
            <button
              className="windowYaxisSize_btn"
              onClick={() => toggleWideMode('Y')}
              title={`창 세로 ${state.isWideY ? '축소' : '확대'}`}
            >
              {state.isWideY ? (
                <CgArrowUpR size="20" />
              ) : (
                <CgArrowDownR size="20" />
              )}
            </button>
            <button
              className="windowXaxisSize_btn"
              onClick={() => toggleWideMode('X')}
              title={`창 가로 ${state.isWideX ? '축소' : '확대'}`}
            >
              {state.isWideX ? (
                <CgArrowLeftR size="20" />
              ) : (
                <CgArrowRightR size="20" />
              )}
            </button>
          </section>
        </section>

        <section className="nav_bottom_section">
          <div
            className="coinSearchBar"
            onClick={() => searchInputRef.current?.focus()}
          >
            <FaSistrix />
            <input
              ref={searchInputRef}
              className="coinSearchInput coinSearchText"
              type="text"
              placeholder="검색"
              onChange={(e) => updateState('searchTerm', e.target.value)}
            />
          </div>
          <div>
            <MarketDropDown
              marketDropDownSelected={state.selectedMarket}
              setmarketDropDownSelected={(value) =>
                updateState('selectedMarket', value)
              }
            />
            <ExchangerDropdown
              dropDownSelected={state.selectedCurrency}
              setDropDownSelected={(value) =>
                updateState('selectedCurrency', value)
              }
            />
          </div>
        </section>
      </nav>

      <table
        className={`${state.isWideX ? 'table_X_wide' : ''} ${
          state.isWideY ? 'table_Y_wide' : ''
        }`}
      >
        <thead>
          <tr>
            <th>코인</th>
            <th onClick={() => toggleSortField('trade_price')}>
              현재가
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              />
            </th>
            <th onClick={() => toggleSortField('change_rate')}>
              전일대비
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              />
            </th>
            <th onClick={() => toggleSortField('acc_trade_price_24h')}>
              거래대금
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              />
            </th>
          </tr>
        </thead>
        {state.selectedCurrency === '업비트' ? (
          <CoinList
            marketDropDownSelected={state.selectedMarket}
            makeSort={state.sortOrder}
            sortElement={state.sortField}
            searchCoinName={state.searchTerm}
            favoriteFnActive={state.isFavoritesActive}
          />
        ) : (
          <BithumbCoinList
            marketDropDownSelected={state.selectedMarket}
            makeSort={state.sortOrder}
            sortElement={state.sortField}
            searchCoinName={state.searchTerm}
            favoriteFnActive={state.isFavoritesActive}
          />
        )}
      </table>
    </div>
  );
};

export default Popup;
