import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./auth";
import MapContextProvider from "./MapContextProvider";


ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MapContextProvider>
        <App />
      </MapContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
