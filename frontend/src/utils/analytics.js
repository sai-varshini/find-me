// src/utils/analytics.js
import ReactGA from "react-ga4";

// Your GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-WT8YC118T2";

// Initialize GA4
export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

// Log a page view
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Log chatbot events
export const logChatEvent = (action, label = "") => {
  ReactGA.event({
    category: "Chatbot",
    action: action,
    label: label,
  });
};
