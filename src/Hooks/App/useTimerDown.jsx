import { useEffect, useRef, useState } from "react";
import {
  getFormattedTime,
  getTimeInMilliseconds,
  getTimeObj,
} from "src/Functions/helper";
import { getLocalStorage, setItemToLocalStorage } from "src/Functions/localStorageFunctions";

/* Props Example
  timeEvent="3 24 60 60" Days-Hours-Minutes-Seconds
  eventName="timerName" localStorage key name
*/

const useTimerDown = (
  downTime,
  { timeResetRequired, stopTimer, timerName, formattedTime }
) => {
  if (!timerName) throw new Error("Timer name is invalid");
  
  useEffect(() => {
    if (timeResetRequired) localStorage.removeItem(timerName);
  }, [timeResetRequired, timerName]);

  const times = downTime.split(" ");
  
  // Initialize state using a lazy initializer to avoid repeated localStorage reads
  const [time, setTime] = useState(() => {
    const timeLocal = getLocalStorage(timerName);
    return timeLocal ? timeLocal : getTimeInMilliseconds(...times);
  });

  const [timeData, setTimeData] = useState(() => getTimeObj(time));
  const [isTimerDone, setIsTimerDone] = useState(false);
  const debounceId = useRef();

  useEffect(() => {
    if (stopTimer || isTimerDone) {
      if (debounceId.current) clearTimeout(debounceId.current);
      return;
    }

    if (time <= -1000) {
      setIsTimerDone(true);
      return;
    }

    debounceId.current = setTimeout(() => {
      const newTime = time - 1000;
      setTime(newTime);
      setItemToLocalStorage(timerName, newTime);

      const timeObj = getTimeObj(newTime);
      if (formattedTime) {
        setTimeData(getFormattedTime(timeObj));
      } else {
        setTimeData(timeObj);
      }
    }, 1000);

    return () => {
      if (debounceId.current) clearTimeout(debounceId.current);
    };
  }, [time, stopTimer, isTimerDone, timerName, formattedTime]);

  return { timeData, isTimerDone };
};

export default useTimerDown;
