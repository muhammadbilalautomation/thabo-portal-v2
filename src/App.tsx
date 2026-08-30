import { useEffect, useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Mic,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
const slideGroups = [
  ["Tourism", 7],
  ["Mining", 8],
  ["Agriculture", 4],
] as const;
const slides = slideGroups.flatMap(([sector, count]) =>
  Array.from(
    { length: count },
    (_, i) =>
      [
        sector,
        `EXPLORE: ${sector.toUpperCase()} INVESTMENT OPPORTUNITIES IN BOTSWANA`,
        `/assets/slides/${sector.toLowerCase()}-${String(i + 1).padStart(2, "0")}.jpeg`,
      ] as const,
  ),
);
const languages = [
  ["English", "en-US", "international"],
  ["French", "fr-FR", "international"],
  ["Chinese", "zh-CN", "international"],
  ["Arabic", "ar-SA", "international"],
  ["Spanish", "es-ES", "international"],
  ["Urdu", "ur-PK", "international"],
  ["Hebrew", "he-IL", "international"],
  ["Russian", "ru-RU", "international"],
  ["Other", "en-US", "international"],
  ["Setswana", "tn-BW", "native"],
  ["Kalanga", "kck-BW", "native"],
  ["Shona", "sn-ZW", "native"],
  ["Ndebele", "nd-ZW", "native"],
  ["Afrikaans", "af-ZA", "native"],
] as const;
const intros: Record<string, string> = {
  English:
    "Welcome to investment opportunities in Botswana. BITC assists investors through one-stop services for investing in Botswana. Click Chat to talk to Thabo and specify your preferred language for communication.",
  French:
    "Bienvenue aux opportunités d’investissement au Botswana. BITC accompagne les investisseurs grâce à un service intégré. Cliquez sur Chat pour parler à Thabo.",
  Chinese:
    "欢迎了解博茨瓦纳的投资机会。BITC通过一站式服务协助投资者在博茨瓦纳投资。点击聊天与Thabo交流。",
  Arabic:
    "مرحباً بكم في فرص الاستثمار في بوتسوانا. يساعد مركز بوتسوانا للاستثمار والتجارة المستثمرين من خلال خدمات النافذة الواحدة. اضغط على الدردشة للتحدث مع ثابو.",
  Spanish:
    "Bienvenido a las oportunidades de inversión en Botsuana. BITC ayuda a los inversores mediante servicios integrales. Haga clic en Chat para hablar con Thabo.",
  Urdu: "بوٹسوانا میں سرمایہ کاری کے مواقع میں خوش آمدید۔ بی آئی ٹی سی سرمایہ کاروں کو ون اسٹاپ خدمات فراہم کرتا ہے۔ تھابو سے بات کرنے کے لیے چیٹ پر کلک کریں۔",
  Hebrew:
    "ברוכים הבאים להזדמנויות ההשקעה בבוטסואנה. BITC מסייע למשקיעים באמצעות שירותי השקעה מרוכזים. לחצו על הצ'אט כדי לדבר עם ת'אבו.",
  Russian:
    "Добро пожаловать в мир инвестиционных возможностей Ботсваны. BITC оказывает инвесторам комплексную поддержку. Нажмите «Чат», чтобы поговорить с Табо.",
  Afrikaans:
    "Welkom by beleggingsgeleenthede in Botswana. BITC ondersteun beleggers met eenstopdienste. Klik op Chat om met Thabo te praat.",
};
export default function App() {
  const [index, setIndex] = useState(0),
    [chat, setChat] = useState(false),
    [voice, setVoice] = useState(true),
    [language, setLanguage] = useState("English"),
    [languageOpen, setLanguageOpen] = useState(false),
    [theme, setTheme] = useState<"dark" | "light">("dark"),
    [message, setMessage] = useState(""),
    [webhookStatus, setWebhookStatus] = useState("");
  const active = slides[index];
  useEffect(() => {
    if (chat) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      2500,
    );
    return () => clearInterval(id);
  }, [chat]);
  useEffect(() => {
    if (chat || !voice || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const selected = languages.find((l) => l[0] === language),
      u = new SpeechSynthesisUtterance(intros[language] ?? intros.English);
    u.lang = selected?.[1] ?? "en-US";
    u.rate = 0.92;
    speechSynthesis.speak(u);
    return () => speechSynthesis.cancel();
  }, [chat, voice, language]);
  const openChat = () => {
    speechSynthesis.cancel();
    setChat(true);
  };
  const sendToWebhook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    const url = import.meta.env.VITE_N8N_TEST_WEBHOOK_URL;
    if (!url) {
      setWebhookStatus("Test webhook URL is not configured yet.");
      return;
    }
    setWebhookStatus("Sending to Thabo workflow…");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            body: message.trim(),
            language,
          },
          source: "thabo-portal",
        }),
      });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
      const data = await response.json().catch(() => null);
      setWebhookStatus(
        data?.output ??
          data?.response ??
          data?.message?.body ??
          (typeof data?.message === "string" ? data.message : null) ??
          "Workflow received your request.",
      );
      setMessage("");
    } catch {
      setWebhookStatus("The test workflow did not respond. Make sure n8n is listening for a test event.");
    }
  };
  return (
    <main className={`portal ${theme}`}>
      <header>
        <div className="brand">
          <span className="brand-mark">
            <img src="/assets/thabo-businessman.jpeg" alt="Thabo" />
          </span>
          <div>
            <b>THABO</b>
            <small>BOTSWANA INVESTMENT CONCIERGE</small>
          </div>
        </div>
        <div className="header-actions">
          <div className="controls">
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button className="sound" onClick={() => setVoice((v) => !v)}>
              {voice ? <Volume2 /> : <VolumeX />}
              {voice ? "Voice-over on" : "Voice-over off"}
            </button>
            <div className="language">
              <button onClick={() => setLanguageOpen((v) => !v)}>
                <span>Voice language</span>
                <b>{language}</b>
                <ChevronDown />
              </button>
              {languageOpen && (
                <div className="language-menu">
                  <p>International languages</p>
                  {languages.filter((l) => l[2] === "international").map((l) => (
                    <button key={l[0]} onClick={() => { setLanguage(l[0]); setLanguageOpen(false); }} className={language === l[0] ? "chosen" : ""}>{l[0]}</button>
                  ))}
                  <p>Native languages</p>
                  {languages.filter((l) => l[2] === "native").map((l) => (
                    <button key={l[0]} onClick={() => { setLanguage(l[0]); setLanguageOpen(false); }} className={language === l[0] ? "chosen" : ""}>{l[0]}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <a href="https://www.bitc.co.bw/" target="_blank">BITC KNOWLEDGE</a>
        </div>
      </header>
      <section className="experience">
        <div className="bitc-backdrop" />
        <div className="backdrop-shade" />
        <div className="headline">
          <span className="live">
            <i /> LIVE INVESTMENT CHANNEL
          </span>
          <p>{active[0]} · Botswana</p>
          <h1>{active[1]}</h1>
        </div>
        <div className="showcase">
          <div className="slide-card">
            {slides.map((s, i) => (
              <img
                key={s[2]}
                className={i === index ? "active" : ""}
                src={s[2]}
                alt={i === index ? `${s[0]} investment opportunity` : ""}
              />
            ))}
            <span className="slide-count">
              0{index + 1} / 0{slides.length}
            </span>
            <span className="sector-tag">{active[0]}</span>
          </div>
          <div className="thabo-center">
            <div className="portrait">
              <img
                src="/assets/thabo-businessman.jpeg"
                alt="Thabo, African investment concierge"
              />
            </div>
            <b>THABO</b>
            <span>Ready to assist investors</span>
          </div>
          <div className="service-card">
            <small>ONE-STOP INVESTOR SERVICES</small>
            <h2>Invest in Botswana with confidence.</h2>
            <p>
              BITC connects investors with opportunity, guidance and coordinated
              support throughout the investment journey.
            </p>
            <button className="primary" onClick={openChat}>
              <MessageCircle /> START CHAT
            </button>
          </div>
        </div>
        <div className="control-bar">
          <nav>
            {slides.map((s, i) => (
              <button
                key={s[2]}
                aria-label={`Show ${s[0]} slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={i === index ? "selected" : ""}
              />
            ))}
          </nav>
        </div>
        <p className="language-prompt">
          Click Chat to talk to Thabo and specify your preferred language for
          communication.
        </p>
      </section>
      {chat && (
        <div className="modal">
          <section className="chat">
            <button className="close" onClick={() => setChat(false)}>
              <X />
            </button>
            <p className="eyebrow">BITC VIRTUAL CONCIERGE</p>
            <h2>Talk to Thabo</h2>
            <p>
              Welcome. Tell me your preferred language, then ask about investing
              in Botswana.
            </p>
            <div className="messages">
              <span>THABO</span>
              <p>How may I support your investment journey today?</p>
            </div>
            <form onSubmit={sendToWebhook}>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your question or preferred language…" />
              <button>
                <Mic /> Speak
              </button>
            </form>
            {webhookStatus && <p className="webhook-status">{webhookStatus}</p>}
            <small>
              Knowledge answers and external actions are processed separately.
              Sensitive actions require approval.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}

