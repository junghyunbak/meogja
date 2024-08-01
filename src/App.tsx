import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { MockApiService } from "./mocking";
import axios from "axios";

function App() {
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
