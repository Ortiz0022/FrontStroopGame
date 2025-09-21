import React from "react";
import type { PlayerDto } from "../types/playerDto";
import type { ChatMsgDto } from "../types/chatDto";


type Props = {
  players: PlayerDto[];
  scoreboard: any[];
  chat: ChatMsgDto[];
  canSend: boolean;
  onSend: (txt: string)=>void;
};

export default function PlayersAndChat({ players, scoreboard, chat, canSend, onSend }: Props){
  const [txt, setTxt] = React.useState("");
  return (
    <div className="grid">
      <div className="card pane">
        <h2>Jugadores</h2>
        <ul className="list players">
          {(players||[]).map((p,i)=>{
            const name = p.Username ?? p.username ?? "user";
            const owner = (p.IsOwner ?? p.isOwner) ? " • owner" : "";
            const seat = p.SeatOrder ?? p.seatOrder ?? "?";
            return <li key={i}><span>{name}</span><span className="small">{owner} #{seat}</span></li>;
          })}
        </ul>
        <h3 style={{marginTop:12}}>Marcador</h3>
        <div className="list" style={{height:180}}>
          {(scoreboard||[]).map((r,i)=>{
            const u = r.Username ?? r.username;
            const s = r.Score ?? r.score;
            const corr = r.TotalCorrect ?? r.totalCorrect ?? 0;
            const wrong = r.TotalWrong ?? r.totalWrong ?? 0;
            const avg = Math.round(r.AvgResponseMs ?? r.avgResponseMs ?? 0);
            return <div key={i} className="item"><b>{u}</b> — Pts: {s} | ✔ {corr} / ✖ {wrong} | {avg} ms</div>;
          })}
        </div>
      </div>

      <div className="card pane">
        <h2>Chat</h2>
        <div className="list">
          {(chat||[]).map((m,i)=>{
            const u = m.Username ?? m.username ?? "user";
            const t = m.Text ?? m.text ?? "";
            return <div key={i} className="item"><b>{u}:</b> {t}</div>;
          })}
        </div>
        <div className="msgline">
          <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); if (txt.trim()) { onSend(txt.trim()); setTxt(""); } } }} placeholder="Escribe un mensaje…" />
          <button onClick={()=>{ if(txt.trim()){ onSend(txt.trim()); setTxt(""); } }} disabled={!canSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
