import React from "react";
import type { RankingRowDto } from "../types/rankingRowDto";


export default function Ranking({ rows }: { rows: RankingRowDto[] }){
  return (
    <div className="card">
      <h2>Ranking global</h2>
      <div className="list" style={{height:160}}>
        {!rows?.length && <div className="item small">Sin datos de ranking aún.</div>}
        {rows?.map((r,i)=>{
          const u = r.Username ?? r.username;
          const wins = r.Wins ?? r.wins;
          const gp = r.GamesPlayed ?? r.gamesPlayed;
          const best = r.BestScore ?? r.bestScore;
          const avg = Math.round(r.AvgMs ?? r.avgMs ?? 0);
          return <div key={i} className="item"><b>#{i+1}</b> {u} — 🏆 {wins} | Partidas: {gp} | Mejor: {best} | Prom. {avg} ms</div>;
        })}
      </div>
    </div>
  );
}
