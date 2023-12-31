import { useEffect, useState } from "react";
import "./App.css";
import { keyvalStore } from "./idb";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

function useTheThing2() {
  const myRandNumber = Math.floor(Math.random() * 10000).toString();
  const [data, setData] = useState({
    myRandNumber,
  });

  useEffect(() => {
    (async () => {
      const lockVal = await keyvalStore.get("lock");
      setData((prev) => ({
        ...prev,
        lock: lockVal,
      }));
      try {
        await keyvalStore.setIfNotExists("lock", myRandNumber);
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

    // if (!localStorage.getItem("thing")) {
    //   localStorage.setItem("thing", myRandNumber);
    //   localStorage.setItem("thing" + myRandNumber, myRandNumber);
    //   setData((prev) => ({
    //     ...prev,
    //     myRandNumber,
    //     numberInLocalStorage: localStorage.getItem("thing"),
    //     keys: Object.keys(localStorage).join(","),
    //   }));
    // }
  }, []);

  return data;
}

function useTheThing3() {
  const [data, setData] = useState({});

  return [
    data,
    async () => {
      const lock = await keyvalStore.get("lock");
      setData((prev) => ({
        ...prev,
        lock,
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
        <div key={key}>
          {key}:{String(value)}
          <br />
          <br />
        </div>
      ))}
      <br />
      <br />
      <br />
      {Object.entries(data2).map(([key, value]) => (
        <div key={key}>
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
          await keyvalStore.del("lock");
        }}
      >
        clear
      </button>
    </>
  );
}

export default App;
