import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </HelmetProvider>,
  );
} catch (e: any) {
  document.body.innerHTML = `<div style="color:red;padding:20px;font-family:monospace"><h1>React Mount Error</h1><pre>${e?.message}\n${e?.stack}</pre></div>`;
  console.error("React Mount Error:", e);
}
