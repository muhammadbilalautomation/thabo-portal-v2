import { useEffect, useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Moon,
  Send,
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
const investorMarqueeItems = [
  "Investor Recruitment",
  "24/7 Virtual Foreign Investor Call Center Assistant",
  "Multi-Language Investor Communication",
  "Free Investor Calls in Multiple Languages",
  "No More Investor Recruitment Language Barriers",
  "Cold Calls and Cold Emails to Investors in Multiple Languages",
  "Support Investor Registrations by Emailing Application Forms in the User’s Language",
  "Investor Orientation and Selling Points",
  "DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS BOTSWANA - +267 75 602 481",
  "DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS [BOTSWANA CITIZEN OWNED] - +267 75 602 481",
];
const languages = [
  ["English", "en-US", "international"],
  ["English (Canada)", "en-CA", "international"],
  ["French", "fr-FR", "international"],
  ["French (Canada)", "fr-CA", "international"],
  ["Chinese", "zh-CN", "international"],
  ["Arabic", "ar-SA", "international"],
  ["Spanish", "es-ES", "international"],
  ["Urdu", "ur-PK", "international"],
  ["Hebrew", "he-IL", "international"],
  ["Russian", "ru-RU", "international"],
  ["Swedish", "sv-SE", "international"],
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
  Swedish:
    "Välkommen till investeringsmöjligheter i Botswana. BITC hjälper investerare genom samordnade tjänster. Klicka på Chat för att prata med Thabo.",
  Afrikaans:
    "Welkom by beleggingsgeleenthede in Botswana. BITC ondersteun beleggers met eenstopdienste. Klik op Chat om met Thabo te praat.",
};
const greetings: Record<string, string> = {
  English: "Welcome. How may I support your investment journey in Botswana today?",
  French: "Bienvenue. Comment puis-je vous accompagner dans votre projet d’investissement au Botswana ?",
  Chinese: "欢迎。今天我能如何协助您在博茨瓦纳的投资之旅？",
  Arabic: "مرحباً. كيف يمكنني مساعدتك اليوم في رحلتك الاستثمارية في بوتسوانا؟",
  Spanish: "Bienvenido. ¿Cómo puedo ayudarle hoy con su inversión en Botsuana?",
  Urdu: "خوش آمدید۔ آج میں بوٹسوانا میں آپ کے سرمایہ کاری کے سفر میں کیسے مدد کر سکتا ہوں؟",
  Hebrew: "ברוכים הבאים. כיצד אוכל לסייע היום במסע ההשקעה שלכם בבוטסואנה?",
  Russian: "Добро пожаловать. Чем я могу помочь вам сегодня с инвестициями в Ботсвану?",
  Swedish: "Välkommen. Hur kan jag hjälpa dig med din investering i Botswana idag?",
  Afrikaans: "Welkom. Hoe kan ek vandag met u belegging in Botswana help?",
};
const languageDetails = (name: string) => languages.find((item) => item[0] === name) ?? languages[0];
const localizedText = (map: Record<string, string>, name: string) => map[name] ?? map[name.split(" (")[0]] ?? map.English;
const speakInSelectedLanguage = async (text: string, name: string) => {
  const locale = languageDetails(name)[1];
  try {
    const response = await fetch("/api/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: name, locale }),
    });
    if (response.ok) {
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      await audio.play();
      return true;
    }
  } catch { /* use an exact browser voice only when available */ }
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return false;
  let voices = speechSynthesis.getVoices();
  if (!voices.length) {
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 1200);
      speechSynthesis.addEventListener("voiceschanged", () => { window.clearTimeout(timer); resolve(); }, { once: true });
    });
    voices = speechSynthesis.getVoices();
  }
  const selectedVoice = voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase()) ??
    voices.find((item) => item.lang.toLowerCase().startsWith(locale.split("-")[0].toLowerCase()));
  if (!selectedVoice) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.voice = selectedVoice;
  utterance.rate = 0.92;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
  return true;
};
const actionKeywords = [
  "research", "search the web", "internet", "google sheet", "spreadsheet",
  "book meeting", "schedule meeting", "cancel meeting", "update meeting",
  "send email", "email draft", "draft email", "find investor", "find contact",
  "تحقیق", "انٹرنیٹ", "گوگل شیٹ", "میٹنگ", "ای میل", "سرمایہ کار",
  "रिसर्च", "इंटरनेट", "गूगल शीट", "मीटिंग", "ईमेल", "निवेशक",
];
type ChatMessage = { id: number; role: "user" | "assistant"; text: string };
export default function App() {
  const [index, setIndex] = useState(0),
    [chat, setChat] = useState(false),
    [voice, setVoice] = useState(true),
    [language, setLanguage] = useState(() => localStorage.getItem("thabo-language") || "English"),
    [languageOpen, setLanguageOpen] = useState(false),
    [theme, setTheme] = useState<"dark" | "light">("dark"),
    [message, setMessage] = useState(""),
    [sending, setSending] = useState(false),
    [voiceNotice, setVoiceNotice] = useState(""),
    [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 1, role: "assistant", text: localizedText(greetings, localStorage.getItem("thabo-language") || "English") },
    ]);
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
    void speakInSelectedLanguage(localizedText(intros, language), language).then((played) =>
      setVoiceNotice(played ? "" : `${language} voice will activate when the ElevenLabs API is connected.`),
    );
    return () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };
  }, [chat, voice, language]);
  useEffect(() => localStorage.setItem("thabo-language", language), [language]);
  const selectLanguage = (name: string) => {
    setLanguage(name);
    setLanguageOpen(false);
    setChatMessages((items) => items.length === 1 ? [{ ...items[0], text: localizedText(greetings, name) }] : items);
  };
  const openChat = () => {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setChat(true);
  };
  const sendToWebhook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    const question = message.trim();
    const isAction = actionKeywords.some((keyword) => question.toLowerCase().includes(keyword));
    setChatMessages((items) => [...items, { id: Date.now(), role: "user", text: question }]);
    setMessage("");
    setSending(true);
    try {
      if (/^(hi|hy|hello|hey|salaam|salam|سلام|ہیلو|नमस्ते|مرحبا)[!.?\s]*$/i.test(question)) {
        const answer = localizedText(greetings, language);
        setChatMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: answer }]);
        if (voice) void speakInSelectedLanguage(answer, language);
        return;
      }
      if (!isAction) {
        const response = await fetch("/api/knowledge/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: question, language, limit: 4 }),
        });
        if (!response.ok) throw new Error(`Knowledge API returned ${response.status}`);
        const data = await response.json();
        const answer = data.matches?.[0]?.answer ?? "I could not find that information in the BITC knowledge base.";
        setChatMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: answer }]);
        if (voice) {
          void speakInSelectedLanguage(answer, language);
        }
        return;
      }
      const url = import.meta.env.VITE_N8N_TEST_WEBHOOK_URL;
      if (!url) throw new Error("Test webhook URL is not configured yet.");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            body: question,
            language,
          },
          source: "thabo-portal",
        }),
      });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
      const data = await response.json().catch(() => null);
      const answer = data?.output ??
          data?.response ??
          data?.message?.body ??
          (typeof data?.message === "string" ? data.message : null) ??
          "Your request was received and the workflow completed successfully.";
      setChatMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: answer }]);
      if (voice) void speakInSelectedLanguage(answer, language);
    } catch (error) {
      setChatMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: error instanceof Error ? error.message : "The requested service did not respond." }]);
    } finally {
      setSending(false);
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
                    <button key={l[0]} onClick={() => selectLanguage(l[0])} className={language === l[0] ? "chosen" : ""}>{l[0]}</button>
                  ))}
                  <p>Native languages</p>
                  {languages.filter((l) => l[2] === "native").map((l) => (
                    <button key={l[0]} onClick={() => selectLanguage(l[0])} className={language === l[0] ? "chosen" : ""}>{l[0]}</button>
                  ))}
                </div>
              )}
            </div>
            {voiceNotice && <span className="voice-notice">{voiceNotice}</span>}
          </div>
          <a href="https://www.bitc.co.bw/" target="_blank">BITC KNOWLEDGE</a>
        </div>
      </header>
      <section className="experience">
        <div className="bitc-backdrop" />
        <div className="backdrop-shade" />
        <section className="investor-marquee" aria-label="Investor services">
          <div className="investor-marquee-track" aria-hidden="true">
            {[...investorMarqueeItems, ...investorMarqueeItems].map((item, itemIndex) => (
              <span key={`${item}-${itemIndex}`}><i />{item}</span>
            ))}
          </div>
          <p className="sr-only">{investorMarqueeItems.join(". ")}</p>
        </section>
        <div className="headline">
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
              <MessageCircle /> TALK TO THABO
            </button>
            <a className="qr-card" href="https://bitcassist-hub2w6hr.manus.space" target="_blank" rel="noreferrer">
              <img src="/assets/ecosystem/thabo-qr-code.png" alt="QR code to open the Thabo portal" />
              <span><b>SCAN TO ACCESS THABO</b><small>Open the portal on your phone</small></span>
            </a>
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
      <section className="ecosystem" aria-labelledby="ecosystem-title">
        <p>OFFICIAL ECOSYSTEM</p>
        <h2 id="ecosystem-title">Botswana investment and trade network</h2>
        <div className="ecosystem-logos">
          <div><img src="/assets/ecosystem/go-botswana.jpg" alt="Go Botswana and Botswana Investment and Trade Centre" /></div>
          <div><img src="/assets/ecosystem/global-expo-botswana.jpg" alt="Global Expo Botswana" /></div>
          <div><img src="/assets/ecosystem/bitc.jpg" alt="Botswana Investment and Trade Centre" /></div>
        </div>
      </section>
      {!chat && <button className="floating-chat" onClick={openChat} aria-label="Talk to Thabo">
        <span><MessageCircle /></span><b>TALK TO THABO</b>
      </button>}
      {chat && (
        <div className="modal">
          <section className="chat">
            <button className="close" onClick={() => setChat(false)}>
              <X />
            </button>
            <div className="chat-heading">
              <img src="/assets/thabo-businessman.jpeg" alt="Thabo" />
              <div><p className="eyebrow">BITC VIRTUAL CONCIERGE</p><h2>Talk to Thabo</h2><span><i /> Online</span></div>
            </div>
            <div className="messages" aria-live="polite">
              {chatMessages.map((item) => (
                <div key={item.id} className={`message-bubble ${item.role}`}>
                  <span>{item.role === "assistant" ? "THABO" : "YOU"}</span>
                  <p>{item.text}</p>
                </div>
              ))}
              {sending && <div className="typing"><i /><i /><i /></div>}
            </div>
            <form onSubmit={sendToWebhook}>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your question or preferred language…" />
              <button disabled={sending || !message.trim()}><Send /> Send</button>
            </form>
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

