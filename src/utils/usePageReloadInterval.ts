import { useEffect, useState } from "react";

const usePageReloadInterval = (intervalTime: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(Date.now()),
      intervalTime * 1000
    );
    return () => {
      clearInterval(interval);
    };
  }, [intervalTime]);
};

export default usePageReloadInterval;
