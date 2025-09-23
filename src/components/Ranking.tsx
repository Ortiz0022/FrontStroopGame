import React from "react";
import type { RankingRowDto } from "../types/rankingRowDto";

export default function Ranking({ rows }: { rows: RankingRowDto[] }) {
  return (
    <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 mb-5">
    
      <div className="list space-y-3 overflow-auto" style={{ height: 160 }}>
        {!rows?.length && <div className="item small text-white">Sin datos de ranking aún.</div>}
        {rows?.map((r, i) => {
          const u = r.Username ?? r.username ?? "user";
          const wins = r.Wins ?? r.wins ?? 0;
          const gp = r.GamesPlayed ?? r.gamesPlayed ?? 0;
          const best = r.BestScore ?? r.bestScore ?? 0;
          const avg = Math.round(r.AvgMs ?? r.avgMs ?? 0);
          return (
            <div
              key={i}
              className=""
            >
              
            </div>
          );
        })}
      </div>
    </div>
  );
}