import * as React from "react";
import type { RankingRowDto } from "../types/rankingRowDto";

type ScoreRow = {
  Username?: string; username?: string;
  Score?: number; score?: number;
  TotalCorrect?: number; totalCorrect?: number;
  TotalWrong?: number; totalWrong?: number;
  AvgResponseMs?: number; avgResponseMs?: number;
};

export default function FinalResults({
  board,
  ranking,
  onBack,            // 👈 NUEVO
}: {
  board: ScoreRow[];
  ranking: RankingRowDto[];
  onBack?: () => void; // 👈 NUEVO
}) {
  return (
    <>
      <div className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2>Resultados</h2>
        <button onClick={onBack}>Volver a la sala</button> {/* 👈 NUEVO */}
      </div>

      <div className="grid">
        {/* Scoreboard final */}
        <div className="card pane">
          <h2>Resultados de la partida</h2>
          <div className="list" style={{ height: 320 }}>
            {(!board || board.length === 0) && (
              <div className="item small">Sin datos.</div>
            )}
            {(board || []).map((r, i) => {
              const u = r.Username ?? r.username ?? "user";
              const s = Number(r.Score ?? r.score ?? 0);
              const corr = Number(r.TotalCorrect ?? r.totalCorrect ?? 0);
              const wrong = Number(r.TotalWrong ?? r.totalWrong ?? 0);
              const avg = Math.round(Number(r.AvgResponseMs ?? r.avgResponseMs ?? 0));
              return (
                <div key={i} className="item">
                  <b>{u}</b> — Pts: {s} | ✔ {corr} / ✖ {wrong} | {avg} ms
                </div>
              );
            })}
          </div>
        </div>

        {/* Ranking global */}
        <div className="card pane">
          <h2>Ranking global</h2>
          <div className="list" style={{ height: 320 }}>
            {(!ranking || ranking.length === 0) && (
              <div className="item small">Sin datos de ranking aún.</div>
            )}
            {(ranking || []).map((r: any, i) => {
              const u    = r.Username ?? r.username ?? "user";
              const wins = Number(r.Wins ?? r.wins ?? 0);
              const gp   = Number(r.GamesPlayed ?? r.gamesPlayed ?? 0);
              const best = Number(r.BestScore ?? r.bestScore ?? 0);
              const avg  = Math.round(Number(r.AvgMs ?? r.avgMs ?? 0));
              return (
                <div key={i} className="item">
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
