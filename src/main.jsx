import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import AppContextProvider from "./context/context.jsx";
createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <StrictMode>
      <App />
    </StrictMode>
    ,
  </AppContextProvider>,
);
