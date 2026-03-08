import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import * as servicerWorker from "../public/register-pwa.js";
import App from "./App.jsx";
import { store } from "./App/store.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./Styles/main.scss";
import "./i18n.js";

const GOOGLE_CLIENT_ID = "25437704042-mt4hjl2kpcle7ugj8ok17ams46emhr52.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);

// servicerWorker.register();
