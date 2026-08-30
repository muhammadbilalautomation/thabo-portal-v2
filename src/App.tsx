import { useEffect, useState } from "react";
import { MessageCircle, Mic, Pause, Volume2, VolumeX, X } from "lucide-react";

const slides = [
  ["Tourism", "EXPLORE: TOURISM INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/tourism-01.jpeg"],
  ["Mining", "EXPLORE: MINING INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/mining-01.jpeg"],
  ["Agriculture", "EXPLORE: AGRICULTURE INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/agriculture-01.jpeg"],
  ["Tourism", "EXPLORE: TOURISM INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/tourism-02.jpeg"],
  ["Mining", "EXPLORE: MINING INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/mining-02.jpeg"],
  ["Agriculture", "EXPLORE: AGRICULTURE INVESTMENT OPPORTUNITIES IN BOTSWANA", "/assets/agriculture-02.jpeg"],
] as const;

const voiceText = (sector: string) => `Welcome to investment opportunities in Botswana. Explore ${sector.toLowerCase()} investment opportunities in Botswana. BITC assists investors through one-stop services for investing in Botswana. Click Chat to talk to Thabo and specify your preferred language for communication.`;

export default function App() {
  const [index, setIndex] = useState(0);
  const [chat, setChat] = useState(false);
  const [voice, setVoice] = useState(true);
  const active = slides[index];
  useEffect(() => { if (chat) return; const id = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 28000); return () => clearInterval(id); }, [chat]);
  useEffect(() => { if (chat || !voice || !("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(voiceText(active[0])); u.rate=.92; speechSynthesis.speak(u); return () => speechSynthesis.cancel(); }, [active, chat, voice]);
  const openChat = () => { speechSynthesis.cancel(); setChat(true); };
  return <main>
    <header><div className="brand"><span className="brand-mark">TH</span><div><b>THABO</b><small>BOTSWANA INVESTMENT CONCIERGE</small></div></div><a href="https://www.bitc.co.bw/" target="_blank">BITC KNOWLEDGE</a></header>
    <section className="stage">
      {slides.map((s,i)=><img key={s[2]} className={i===index?"active":""} src={s[2]} alt={i===index?`${s[0]} investment opportunity`:""}/>)}
      <div className="shade"/><div className="pattern"/>
      <div className="copy"><span className="live"><i/> LIVE INVESTMENT CHANNEL</span><p className="sector">{active[0]} · Botswana</p><h1>{active[1]}</h1><p className="lede">BITC provides one-stop investor services, connecting opportunity with the support required to invest confidently in Botswana.</p><div className="actions"><button className="primary" onClick={openChat}><MessageCircle/> CLICK CHAT TO TALK TO THABO</button><button className="sound" onClick={()=>setVoice(v=>!v)}>{voice?<Volume2/>:<VolumeX/>}{voice?"Voice-over on":"Voice-over off"}</button></div><p className="language-prompt">Tell Thabo your preferred language when the conversation begins.</p><nav>{slides.map((s,i)=><button aria-label={`Show ${s[0]} slide ${i+1}`} onClick={()=>setIndex(i)} className={i===index?"selected":""}/>)}</nav></div>
      <aside><div className="portrait"><img src="/assets/thabo-businessman.jpeg" alt="Thabo, African investment concierge"/></div><b>THABO</b><span>Ready to assist investors</span></aside>
    </section>
    <section className="sectors"><article><b>01</b><h2>Tourism</h2><p>Premium experiences, hospitality and conservation-led growth.</p></article><article><b>02</b><h2>Mining</h2><p>Responsible development, services and local value addition.</p></article><article><b>03</b><h2>Agriculture</h2><p>Production, processing and export-ready value chains.</p></article></section>
    {chat&&<div className="modal"><section className="chat"><button className="close" onClick={()=>setChat(false)}><X/></button><p className="eyebrow">BITC VIRTUAL CONCIERGE</p><h2>Talk to Thabo</h2><p>Welcome. Tell me your preferred language, then ask about investing in Botswana.</p><div className="messages"><span className="bot">THABO</span><p>How may I support your investment journey today?</p></div><form onSubmit={e=>e.preventDefault()}><input placeholder="Type your question or preferred language…"/><button><Mic/> Speak</button></form><small>Knowledge answers and external actions are processed separately. Sensitive actions require approval.</small></section></div>}
  </main>;
}

