export const upbitWebsocketUtil = () => {
  return (state, action) => {
    const assignObj = { ...state.upbitTickers };
    for (let key in action.payload) {
      // 초기 데이터와 websocket 데이터 병합
      assignObj[key] = Object.assign(assignObj[key], action.payload[key]);
      // 데이터 change_rate 음수 값 표기 : 배열 소팅 목적
      if (assignObj[key]['change'] === 'FALL') {
        assignObj[key]['change_rate'] = assignObj[key]['change_rate'] * -1;
      }
    }
    // Todo : 데이터 blink 효과, 가격 up down 변동

    return {
      ...state,
      upbitTickers: {
        ...assignObj,
      },
    };
  };
};

export const setUpbitTickersArrUtil = () => {
  return (state) => {
    const upbitTickers = { ...state.upbitTickers };
    const upbitTickersKRW = [];
    const upbitTickersBTC = [];

    for (let key in upbitTickers) {
      if (upbitTickers[key]['market'].includes('KRW-')) {
        upbitTickersKRW.push(upbitTickers[key]);
      } else if (upbitTickers[key]['market'].includes('BTC-')) {
        upbitTickersKRW.push(upbitTickers[key]);
      }
    }

    return {
      ...state,
      upbitTickersKRW: [...upbitTickersKRW],
      upbitTickersBTC: [...upbitTickersBTC],
    };
  };
};

export const bithumbTransactionUtil = (state, action) => {
  const assignedObj = { ...state.bithumbTickers };

  for (let key in action.payload) {
    if (assignedObj[key] && action.payload[key] !== undefined) {
      assignedObj[key] = Object.assign(assignedObj[key], action.payload[key]);
    }
  }

  return {
    ...state,
    bithumbTickers: {
      ...assignedObj,
    },
  };
};

export const bithumbWebsocketUtil = (state, action) => {
  const assignObj = { ...state.bithumbTickers };
  for (let key in action.payload) {
    // 초기 데이터와 websocket 데이터 병합
    if (assignObj[key]) {
      assignObj[key] = Object.assign(assignObj[key], action.payload[key]);
    }
  }
  return {
    ...state,
    bithumbTickers: {
      ...assignObj,
    },
  };
};
