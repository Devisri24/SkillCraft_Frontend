import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BotpressChatLoader = () => {
  const location = useLocation(); // ✅ get current path

  useEffect(() => {
    if (location.pathname !== "/dashboard") return; // ❌ Don't load bot unless on /dashboard

    // Inject Botpress Webchat script
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.1/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/07/29/16/20250729163218-3TCFAR6H.js"; // ✅ your actual bot
    script2.async = true;

    script2.onload = () => {
      window.botpressWebChat.init({
        showWidget: false,
        showPoweredBy: false,
      });
    };

    document.body.appendChild(script2);
  }, [location]);

  return null;
};

export default BotpressChatLoader;
