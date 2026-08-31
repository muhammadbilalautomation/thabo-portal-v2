import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const knowledge = JSON.parse(await readFile(new URL("./knowledge-base.json", import.meta.url), "utf8"));
try {
  const env = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const split = line.indexOf("=");
    if (split > 0 && !line.startsWith("#")) process.env[line.slice(0, split).trim()] ||= line.slice(split + 1).trim();
  }
} catch { /* local secrets are optional during setup */ }
const port = Number(process.env.KNOWLEDGE_PORT || 8787);
const normalize = (value = "") => value.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();

function search(query, limit = 4) {
  const normalized = normalize(query);
  const tokens = new Set(normalized.split(" ").filter((word) => word.length > 2));
  return knowledge.entries.map((entry) => {
    const searchable = normalize([entry.question, entry.answer, ...entry.keywords].join(" "));
    const normalizedQuestion = normalize(entry.question);
    let score = entry.keywords.reduce((total, keyword) => total + (normalized.includes(normalize(keyword)) ? 5 : 0), 0);
    for (const token of tokens) {
      if (searchable.includes(token)) score += 1;
      if (normalizedQuestion.includes(token)) score += 3;
    }
    return { ...entry, score };
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method === "OPTIONS") return response.end();
  if (request.url === "/api/knowledge/health") return response.end(JSON.stringify({ ok: true, entries: knowledge.entries.length }));
  if (request.method === "POST" && request.url === "/api/voice/speak") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const body = JSON.parse(raw || "{}");
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId) { response.statusCode = 503; return response.end(JSON.stringify({ error: "ElevenLabs is not configured" })); }
    const audio = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey, "Accept": "audio/mpeg" },
      body: JSON.stringify({ text: String(body.text || ""), model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.52, similarity_boost: 0.78 } }),
    });
    if (!audio.ok) { response.statusCode = audio.status; return response.end(JSON.stringify({ error: "ElevenLabs request failed" })); }
    response.setHeader("Content-Type", "audio/mpeg");
    response.end(Buffer.from(await audio.arrayBuffer()));
    return;
  }
  if (request.method === "POST" && request.url === "/api/knowledge/search") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    try {
      const body = JSON.parse(raw || "{}");
      const query = String(body.query || "").trim();
      if (!query) { response.statusCode = 400; return response.end(JSON.stringify({ error: "query is required" })); }
      const matches = search(query, Math.min(Number(body.limit) || 4, 6));
      return response.end(JSON.stringify({ route: "knowledge", query, language: body.language || "English", matches, context: matches.map((item) => `${item.question}\n${item.answer}\nSource: ${item.sourceUrl}`).join("\n\n") }));
    } catch { response.statusCode = 400; return response.end(JSON.stringify({ error: "invalid JSON" })); }
  }
  response.statusCode = 404;
  response.end(JSON.stringify({ error: "not found" }));
}).listen(port, "127.0.0.1", () => console.log(`BITC Knowledge API listening on http://127.0.0.1:${port}`));

