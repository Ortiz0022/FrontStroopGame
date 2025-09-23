import * as React from "react";
import type { RankingRowDto } from "../types/rankingRowDto";

type ScoreRow = {
  Username?: string;
  username?: string;
  Score?: number;
  score?: number;
  TotalCorrect?: number;
  totalCorrect?: number;
  TotalWrong?: number;
  totalWrong?: number;
  AvgResponseMs?: number;
  avgResponseMs?: number;
};

export default function FinalResults({
  board,
  ranking,
  onBack, 
}: {
  board: ScoreRow[];
  ranking: RankingRowDto[];
  onBack?: () => void; 
}) {
  return (
    <>
      <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 flex justify-between items-center mb-5">
        <h2 className="text-yellow-400 text-2xl font-extrabold">Resultados</h2>
        <button
          onClick={onBack}
          className="rounded-2xl bg-cyan-600 text-white px-5 py-3 font-bold hover:bg-cyan-700 transition"
        >
          Volver a la sala
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Scoreboard final */}
        <div className="card pane border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7">
          <h2 className="text-yellow-400 text-2xl font-extrabold mb-4">Resultados de la partida</h2>
          <div className="list space-y-3 overflow-auto" style={{ height: 320 }}>
            {(!board || board.length === 0) && <div className="item small text-white">Sin datos.</div>}
            {(board || []).map((r, i) => {
              const u = r.Username ?? r.username ?? "user";
              const s = Number(r.Score ?? r.score ?? 0);
              const corr = Number(r.TotalCorrect ?? r.totalCorrect ?? 0);
              const wrong = Number(r.TotalWrong ?? r.totalWrong ?? 0);
              const avg = Math.round(Number(r.AvgResponseMs ?? r.avgResponseMs ?? 0));
              return (
                <div
                  key={i}
                  className="item bg-[#151c38] rounded-2xl px-8 py-4 text-lg text-white flex justify-between"
                >
                  <b>{u}</b> — Pts: {s} | ✔ {corr} / ✖ {wrong} | {avg} ms
                </div>
              );
            })}
          </div>
        </div>

        {/* Ranking global */}
        <div className="card pane border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7">
          <h2 className="text-yellow-400 text-2xl font-extrabold mb-4">Ranking global</h2>
          <div className="list space-y-3 overflow-auto" style={{ height: 320 }}>
            {(!ranking || ranking.length === 0) && (
              <div className="item small text-white">Sin datos de ranking aún.</div>
            )}
            {(ranking || []).map((r: any, i) => {
              const u = r.Username ?? r.username ?? "user";
              const wins = Number(r.Wins ?? r.wins ?? 0);
              const gp = Number(r.GamesPlayed ?? r.gamesPlayed ?? 0);
              const best = Number(r.BestScore ?? r.bestScore ?? 0);
              const avg = Math.round(Number(r.AvgMs ?? r.avgMs ?? 0));
              return (
                <div
                  key={i}
                  className="item bg-[#151c38] rounded-2xl px-8 py-4 text-lg text-white flex justify-between"
                >
                  <b>#{i + 1}</b> {u} — 🏆 {wins} | Partidas: {gp} | Mejor: {best} | Prom. {avg} ms
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}