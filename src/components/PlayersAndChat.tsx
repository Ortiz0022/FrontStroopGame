import React from "react";
import type { PlayerDto } from "../types/playerDto";
import type { ChatMsgDto } from "../types/chatDto";

type Props = {
  players: PlayerDto[];
  scoreboard: any[];
  chat: ChatMsgDto[];
  canSend: boolean;
  onSend: (txt: string) => void;
};

export default function PlayersAndChat({ players, scoreboard, chat, canSend, onSend }: Props) {
  const [txt, setTxt] = React.useState("");
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-5 flex flex-col">
        <h2 className="text-yellow-400 font-extrabold text-2xl mb-4">Jugadores</h2>
        <ul className="mb-6 overflow-auto max-h-64">
          {(players || []).map((p, i) => {
            const name = p.Username ?? p.username ?? "user";
            const owner = (p.IsOwner ?? p.isOwner) ? " • owner" : "";
            return (
              <li key={i} className="flex justify-between text-white border-b border-[#0a1a32] py-1">
                <span>{name}</span>
                <span className="text-sky-400 small">{owner}</span>
              </li>
            );
          })}
        </ul>

        <h3 className="text-yellow-400 text-xl font-bold mb-3">Marcador</h3>
        <div className="overflow-auto max-h-44">
          {(scoreboard || []).map((r, i) => {
            const u = r.Username ?? r.username ?? "user";
            const s = r.Score ?? r.score ?? 0;
            const corr = r.TotalCorrect ?? r.totalCorrect ?? 0;
            const wrong = r.TotalWrong ?? r.totalWrong ?? 0;
            const avg = Math.round(r.AvgResponseMs ?? r.avgResponseMs ?? 0);
            return (
              <div
                key={i}
                className="bg-[#151c38] rounded-2xl px-6 py-3 text-white flex justify-between mb-1"
              >
                <b>{u}</b>
                <span>
                  Pts: {s} | ✔ {corr} / ✖ {wrong} | {avg} ms
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-5 flex flex-col">
        <h2 className="text-yellow-400 font-extrabold text-2xl mb-4">Chat</h2>
        <div className="overflow-auto flex-grow mb-4 max-h-72">
          {(chat || []).map((m, i) => {
            const u = m.Username ?? m.username ?? "user";
            const t = m.Text ?? m.text ?? "";
            return (
              <div key={i} className="bg-[#151c38] rounded-2xl px-6 py-2 text-white mb-1">
                <b>{u}:</b> {t}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <input
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (txt.trim()) {
                  onSend(txt.trim());
                  setTxt("");
                }
              }
            }}
            placeholder="Escribe un mensaje…"
            className="flex-1 rounded-xl bg-[#0a1a32] border-2 border-[#1f3359] text-sky-200 px-4 py-3 tracking-widest placeholder:text-sky-500 focus:outline-none"
          />
          <button
            onClick={() => {
              if (txt.trim()) {
                onSend(txt.trim());
                setTxt("");
              }
            }}
            disabled={!canSend}
            className="rounded-xl px-6 py-3 font-extrabold tracking-wide text-xl shadow-inner uppercase
            bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-orange-700 text-brown-900
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}