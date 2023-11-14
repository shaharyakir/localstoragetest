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
  });

  useEffect(() => {
    const myRandNumber = Math.floor(Math.random() * 10000).toString();
    if (!localStorage.getItem("thing")) {
      localStorage.setItem("thing", myRandNumber);
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

function App() {
  const { data, stop, clear } = useTheThing();

  return (
    <>
      {Object.entries(data).map(([key, value]) => (
        <div>
          {key}:{String(value)}
          <br />
          <br />
        </div>
      ))}
      <button
        onClick={() => {
          stop();
        }}
      >
        stop
      </button>
      <button
        onClick={() => {
          clear();
        }}
      >
        clear
      </button>
    </>
  );
}

export default App;
