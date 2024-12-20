import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startInit, startBithumb } from './Reducer/coinReducer.jsx';
import './Popup.css';

import CoinList from './Components/Upbit/CoinList.jsx';
import ExchangerDropdown from './Components/Common/Dropdown/ExchangerDropdown';
import MarketDropDown from './Components/Common/Dropdown/marketDropDown';
import BithumbCoinList from './Components/Bithumb/BithumbCoinList.jsx';

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

const Popup = () => {
  const lastestCurrency = localStorage.getItem('como_lastest_currency')
    ? localStorage.getItem('como_lastest_currency')
    : '업비트';
  const lastestXwideState = localStorage.getItem('como_lastest_xwide')
    ? localStorage.getItem('como_lastest_xwide') === 'true'
    : false;
  const lastestYwideState =
    localStorage.getItem('como_lastest_ywide') === 'true'
      ? localStorage.getItem('como_lastest_ywide')
      : false;

  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const [makeSort, setMakeSort] = useState('decending');
  const [sortElement, setSortElement] = useState('trade_price');
  const [dropDownSelected, setDropDownSelected] = useState(lastestCurrency);
  const [marketDropDownSelected, setmarketDropDownSelected] = useState('KRW');
  const [searchCoinName, setSearchCoinName] = useState('');
  const [windowXaxisSize, setWindowXaxisSize] = useState(lastestXwideState);
  const [windowYaxisSize, setWindowYaxisSize] = useState(lastestYwideState);
  const [favoriteFnActive, setFavoriteFnActive] = useState(true);

  useEffect(() => {
    dispatch(startInit());
    dispatch(startBithumb());
  }, [dispatch]);

  const windowResize = (param) => {
    return param === 'windowYaxisSize'
      ? localStorage.setItem('como_lastest_ywide', !windowYaxisSize)
      : localStorage.setItem('como_lastest_xwide', !windowXaxisSize);
  };

  const handleSortPrice = () => {
    setSortElement('trade_price');

    makeSort === 'ascending'
      ? setMakeSort('decending')
      : setMakeSort('ascending');
  };

  const handleSortRate = () => {
    setSortElement('change_rate');

    makeSort === 'ascending'
      ? setMakeSort('decending')
      : setMakeSort('ascending');
  };

  const handleSortTotal = () => {
    setSortElement('acc_trade_price_24h');

    makeSort === 'ascending'
      ? setMakeSort('decending')
      : setMakeSort('ascending');
  };

  return (
    <div className="App">
      <nav>
        <section className="nav_top_section">
          <img src={defaultcomologo}></img>

          <section>
            <div
              className={
                favoriteFnActive
                  ? 'favorites_btn favorites_fn_active'
                  : 'favorites_btn favorites_fn_inactive'
              }
              onClick={() => {
                setFavoriteFnActive(!favoriteFnActive);
              }}
              data-tip
              data-for="favorites_btn_tooltip"
              title={`즐겨찾기 ${favoriteFnActive ? '비활성화' : '활성화'}`}
            >
              {favoriteFnActive ? <AiFillStar /> : <FiStar />}
            </div>
            <div
              className="windowYaxisSize_btn"
              onClick={() => {
                setWindowYaxisSize(!windowYaxisSize);
                windowResize('windowYaxisSize');
              }}
              data-tip
              data-for="windowYaxisSize_btn_tooltip"
              title={`창 세로 ${windowYaxisSize ? '축소' : '확대'}`}
            >
              {windowYaxisSize ? (
                <CgArrowUpR size="20" />
              ) : (
                <CgArrowDownR size="20" />
              )}
            </div>
            <div
              className="windowXaxisSize_btn"
              onClick={() => {
                setWindowXaxisSize(!windowXaxisSize);
                windowResize('windowXaxisSize');
              }}
              data-tip
              data-="windowXaxisSize_btn_tooltip"
              title={`창 가로 ${windowXaxisSize ? '축소' : '확대'}`}
            >
              {windowXaxisSize ? (
                <CgArrowLeftR size="20" />
              ) : (
                <CgArrowRightR size="20" />
              )}
            </div>
          </section>
        </section>

        <section className="nav_bottom_section">
          <div
            className="coinSearchBar"
            onClick={() => {
              searchInputRef.current.focus();
            }}
          >
            <FaSistrix />
            <input
              ref={searchInputRef}
              className="coinSearchInput coinSearchText"
              type="text"
              placeholder=""
              onChange={(e) => {
                setSearchCoinName(e.target.value);
              }}
            />
            검색
          </div>

          <div>
            <MarketDropDown
              marketDropDownSelected={marketDropDownSelected}
              setmarketDropDownSelected={setmarketDropDownSelected}
            />
            <ExchangerDropdown
              dropDownSelected={dropDownSelected}
              setDropDownSelected={setDropDownSelected}
            />
          </div>
        </section>
      </nav>
      <table
        className={`${windowXaxisSize ? 'table_X_wide' : ''} ${
          windowYaxisSize ? 'table_Y_wide' : ''
        }`}
      >
        <thead>
          <tr>
            <th>
              <div>코인</div>
            </th>
            <th onClick={handleSortPrice}>
              <div>현재가</div>
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              ></img>
            </th>
            <th onClick={handleSortRate}>
              <div>전일대비</div>
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              ></img>
            </th>
            <th onClick={handleSortTotal}>
              <div>거래대금</div>
              <img
                src="https://cdn.upbit.com/images/ico_up_down.d050377.png"
                alt=""
              ></img>
            </th>
          </tr>
        </thead>
        {dropDownSelected === '업비트' && (
          <CoinList
            marketDropDownSelected={marketDropDownSelected}
            makeSort={makeSort}
            sortElement={sortElement}
            searchCoinName={searchCoinName}
            favoriteFnActive={favoriteFnActive}
          />
        )}
        {dropDownSelected === '빗썸' && (
          <BithumbCoinList
            marketDropDownSelected={marketDropDownSelected}
            makeSort={makeSort}
            sortElement={sortElement}
            searchCoinName={searchCoinName}
            favoriteFnActive={favoriteFnActive}
          />
        )}
      </table>
    </div>
  );
};

export default Popup;
