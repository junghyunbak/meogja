import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { MockApiService } from "./mocking";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    new MockApiService().register();

    (async () => {
      let userId = localStorage.getItem("userId");

      if (!userId) {
        const {
          data: {
            data: { id },
          },
        } = await axios.post<ResponseTemplate<{ id: string }>>("/api/join");

        userId = id;
      }

      localStorage.setItem("userId", userId);

      await axios.get("/api/chk-user-id", { params: { userId } });
    })();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs flex w-full">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
