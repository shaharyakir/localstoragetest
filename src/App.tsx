import { useEffect, useState } from "react";
import "./App.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

function useTheThing() {
  const [intervalId, setIntevalId] = useState(0);

  const [data, setData] = useState({
    local: "",
    cloud: "",
    cloudSetError: "",
    cloudGetError: "",
    myRandNumber: "",
  });

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      setData((prev) => ({
        ...prev,
        storageEventKey: e.key,
        storageEventNewValue: e.newValue,
        storageEventOldValue: e.oldValue,
      }));
    });

    const myRandNumber = Math.floor(Math.random() * 10000).toString();
    if (!localStorage.getItem("thing")) {
      localStorage.setItem("thing", myRandNumber);
      setData((prev) => ({
        ...prev,
        iDidSetLocalStorage: "true",
      }));

      setTimeout(() => {
        setData((prev) => ({
          ...prev,
          localRightAfterSet: localStorage.getItem("thing"),
        }));
      }, 1);

      setData((prev) => ({ ...prev, myRandNumber }));
    }

    try {
      window.Telegram.WebApp.CloudStorage.getItem("thing", (err, value) => {
        if (err) {
          setData((prev) => ({
            ...prev,
            cloudGetError: String(err),
            cloud: "",
          }));
        } else {
          if (!value) {
            window.Telegram.WebApp.CloudStorage.setItem(
              "thing",
              myRandNumber,
              (err, didSet) => {
                if (err) {
                  setData((prev) => ({ ...prev, cloudSetError: String(err) }));
                } else {
                  setData((prev) => ({
                    ...prev,
                    cloudSetError: didSet ? "set succsefully" : "did not set!",
                  }));
                }
              }
            );
          }
        }
      });
    } catch (e) {
      setData((prev) => ({ ...prev, cloudSetError: String(e) }));
    }
  }, []);

  useEffect(() => {
    setIntevalId(
      setInterval(() => {
        console.log("In loop");
        try {
          window.Telegram.WebApp.CloudStorage.getItem("thing", (err, value) => {
            if (err) {
              setData((prev) => ({
                ...prev,
                cloudGetError: String(err),
                cloud: "",
              }));
            } else {
              setData((prev) => ({ ...prev, cloud: value }));
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setData((prev) => ({ ...prev, cloudGetError: e.toString() }));
        }

        setData((prev) => ({
          ...prev,
          local: localStorage.getItem("thing") || "",
        }));
      }, 1000)
    );
  }, []);

  return {
    data,
    stop: () => clearInterval(intervalId),
    clear: () => {
      localStorage.clear();
      window.Telegram.WebApp.CloudStorage.removeItem("thing");
    },
  };
}

function useTheThing2() {
  const myRandNumber = Math.floor(Math.random() * 10000).toString();
  const [data, setData] = useState({});

  useEffect(() => {
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
    () => {
      setData((prev) => ({
        ...prev,
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
        onClick={() => {
          localStorage.clear();
        }}
      >
        clear
      </button>
    </>
  );
}

export default App;
