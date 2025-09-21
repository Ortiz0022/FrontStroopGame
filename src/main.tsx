import React from "react";
import ReactDOM from "react-dom/client";
import "./game.css";
import { RouterProvider } from "@tanstack/react-router";
import { gameRouter } from "./router/router";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <RouterProvider router={gameRouter} />
     {/*<App/>*/}
  </React.StrictMode>
);
