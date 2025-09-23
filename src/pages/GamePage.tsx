import * as React from "react";
import GameBoard from "../components/GameBoard";
import FinalResults from "../components/FinalResults";
import { useLobby } from "../hooks/useLobby";
import { useGame } from "../hooks/useGame";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import connection from "../SignalRService/connection";
import { apiGetCurrentRound } from "../apiConfig/api";

export default function GamePage({ onBack }: { onBack?: () => void }) {
  const { user, roomCode, isOwner, players, isConnected, returnToLobby } = useLobby(); // 👈 NUEVO
  const game = useGame(user?.id ?? null, roomCode ?? null);
  const { roundsPerPlayer, setRoundsPerPlayer, onStartGame } = useWaitingRoom();

  const handleStart = async () => {
    if (!roomCode) return;
    if ((players?.length ?? 0) < 2) {
      alert("Necesitas al menos 2 jugadores para iniciar la partida");
      return;
    }
    await onStartGame(roomCode);
  };

  React.useEffect(() => {
    const onGameStarted = async (p: any) => {
      const rpp = p?.RoundsPerPlayer ?? p?.roundsPerPlayer;
      if (typeof rpp === "number") setRoundsPerPlayer(rpp);
      game.resetGame();
      try {
        if (roomCode) {
          const cur = await apiGetCurrentRound(roomCode);
          if (cur?.HasRound) {
            game.handleNewRound({
              RoundId: cur.RoundId,
              Word: cur.Word,
              InkHex: cur.InkHex,
              Options: cur.Options,
              RemainingForThisPlayer: cur.RemainingForThisPlayer,
            });
          }
        }
      } catch {}
    };

    const onTurnChanged = (t: any) => game.handleTurnChanged(t);
    const onNewRound = (payload: any) => game.handleNewRound(payload);
    const onScoreboard = (rows: any) => game.handleScoreboard(rows);
    const onWinner = (w: any) => game.handleWinner(w);
    const onFinished = (rows: any) => game.handleGameFinished(rows);

    connection.on("GameStarted", onGameStarted);
    connection.on("TurnChanged", onTurnChanged);
    connection.on("NewRound", onNewRound);
    connection.on("Scoreboard", onScoreboard);
    connection.on("Winner", onWinner);
    connection.on("GameFinished", onFinished);

    return () => {
      try { connection.off("GameStarted", onGameStarted); } catch {}
      try { connection.off("TurnChanged", onTurnChanged); } catch {}
      try { connection.off("NewRound", onNewRound); } catch {}
      try { connection.off("Scoreboard", onScoreboard); } catch {}
      try { connection.off("Winner", onWinner); } catch {}
      try { connection.off("GameFinished", onFinished); } catch {}
    };
  }, [roomCode, game, setRoundsPerPlayer]);

  return (
    <div className="wrap">
      <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Rondas por jugador:
          <input type="number" min={1} max={10} value={roundsPerPlayer} readOnly style={{ width: 70, marginLeft: 8 }} />
        </label>

        <button onClick={handleStart} disabled={!isConnected || !isOwner}>
          Iniciar juego (owner)
        </button>

        <span className="pill">{game.turnLabel}</span>
        <span className="pill">
          Sala: <b>{roomCode || "—"}</b> • Jugadores: <b>{players?.length ?? 0}</b>
        </span>
      </div>

      {game.finished ? (
        <FinalResults
          board={game.finalBoard}
          ranking={game.ranking}
          onBack={onBack}
        />
      ) : (
        <>
          {!game.round && (
            <div className="card">
              <h2>Esperando primer round…</h2>
              {!isOwner && <div className="small muted">Espera a que el owner inicie la partida.</div>}
            </div>
          )}

          <GameBoard
            visible={true}
            round={game.round}
            turnLabel={game.turnLabel}
            canAnswer={game.canAnswer}
            onAnswer={game.onAnswer}
          />
        </>
      )}
    </div>
  );
}
