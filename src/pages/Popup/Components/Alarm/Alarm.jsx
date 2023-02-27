import react, { useState, useEffect } from 'react';
import { AiFillBell } from 'react-icons/ai';

const Alram = (tickers) => {
  const [isAlarmselected, setIsAlarmselected] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className={'alarm'}>
      <div
        className={
          isAlarmselected ? `${tickers}_alarm_on` : `${tickers}_alarm_off`
        }
      >
        <AiFillBell />
      </div>
    </div>
  );
};

export default Alram;
