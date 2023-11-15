import { useEffect, useState } from "react";
import "./App.css";
import { drop, getLockValue, tryWriteLock } from "./idb";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

function useTheThing2() {
  const myRandNumber = Math.floor(Math.random() * 10000).toString();
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        tryWriteLock(myRandNumber);
        const lockVal = await getLockValue();
        setData((prev) => ({
          ...prev,
          lockInitial: lockVal,
        }));
      } catch (e) {
        setData((prev) => ({
          ...prev,
          errorLock: e.message,
        }));
      }
    })();

    if (!localStorage.getItem("thing")) {
      localStorage.setItem("thing", myRandNumber);
      localStorage.setItem("thing" + myRandNumber, myRandNumber);
      setData((prev) => ({
        ...prev,
        myRandNumber,
        numberInLocalStorage: localStorage.getItem("thing"),
        keys: Object.keys(localStorage).join(","),
      }));
    }
  }, []);

  return data;
}

function useTheThing3() {
  const [data, setData] = useState({});

  return [
    data,
    async () => {
      const lock = await getLockValue();
      setData((prev) => ({
        ...prev,
        lock,
        newKeys: Object.keys(localStorage).join(","),
      }));
    },
  ];
}

function App() {
  const data = useTheThing2();
  const [data2, refresh] = useTheThing3();

  return (
    <>
      {Object.entries(data).map(([key, value]) => (
        <div>
          {key}:{String(value)}
          <br />
          <br />
        </div>
      ))}
      <br />
      <br />
      <br />
      {Object.entries(data2).map(([key, value]) => (
        <div>
          {key}:{String(value)}
          <br />
          <br />
        </div>
      ))}
      <button
        onClick={() => {
          (refresh as () => void)();
        }}
      >
        refresh
      </button>
      <button
        onClick={async () => {
          localStorage.clear();
          drop();
        }}
      >
        clear
      </button>
    </>
  );
}

export default App;
