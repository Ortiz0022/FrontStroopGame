import React from "react";
import type { RankingRowDto } from "../types/rankingRowDto";

export default function Ranking({ rows }: { rows: RankingRowDto[] }) {
  return (
    <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 mb-5">
      <h2 className="text-yellow-400 text-2xl font-extrabold mb-4">Ranking global</h2>
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
              className="item bg-[#151c38] rounded-2xl px-8 py-4 text-lg text-white flex items-center justify-between"
            >
              <b>#{i + 1}</b> {u} — 🏆 {wins} | Partidas: {gp} | Mejor: {best} | Prom. {avg} ms
            </div>
          );
        })}
      </div>
    </div>
  );
}