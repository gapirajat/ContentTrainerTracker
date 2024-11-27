import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { GeneralProvider } from "./context/generalContext.jsx";
import { Provider } from "react-redux";
import store from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GeneralProvider>
      <AuthProvider>
        <BrowserRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </BrowserRouter>
      </AuthProvider>
    </GeneralProvider>
  </Provider>
);
