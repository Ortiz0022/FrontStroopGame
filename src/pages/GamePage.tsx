import * as React from "react";
import GameBoard from "../components/GameBoard";
import FinalResults from "../components/FinalResults";
import { useLobby } from "../hooks/useLobby";
import { useGame } from "../hooks/useGame";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import connection from "../SignalRService/connection";
import { apiGetCurrentRound, apiReturnToLobby } from "../apiConfig/api";

export default function GamePage({
  onBack,
  playersCount = 0,
}: {
  onBack?: () => void;
  playersCount?: number;
}) {
  const { user, roomCode, isOwner, isConnected } = useLobby();
  const game = useGame(user?.id ?? null, roomCode ?? null);
  const { roundsPerPlayer, setRoundsPerPlayer, onStartGame } = useWaitingRoom();

  const handleBackToLobby = React.useCallback(async () => {
    try {
      if (roomCode) {
        await apiReturnToLobby(roomCode); // resetea back
      }
    } catch {
      console.warn("Falló reset en backend");
    } finally {
      game.resetGame(); // limpia front
      onBack?.(); // notifica a LobbyPage (setGameStarted(false))
    }
  }, [roomCode, game, onBack]);

  const handleStart = async () => {
    if (!roomCode) return;
    if ((playersCount ?? 0) < 2) {
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
              CurrentPlayerUserId: cur.CurrentPlayerUserId, // por si tu endpoint lo retorna
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
      try {
        connection.off("GameStarted", onGameStarted);
      } catch {}
      try {
        connection.off("TurnChanged", onTurnChanged);
      } catch {}
      try {
        connection.off("NewRound", onNewRound);
      } catch {}
      try {
        connection.off("Scoreboard", onScoreboard);
      } catch {}
      try {
        connection.off("Winner", onWinner);
      } catch {}
      try {
        connection.off("GameFinished", onFinished);
      } catch {}
    };
  }, [roomCode, game, setRoundsPerPlayer]);

  return (
    <div className="wrap">
      <div
        className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-5 mb-5 flex gap-3 flex-wrap items-center"
        style={{ alignItems: "center" }}
      >
        <label className="text-white font-bold flex items-center gap-2">
          Rondas por jugador:
          <input
            type="number"
            min={1}
            max={10}
            value={roundsPerPlayer}
            readOnly
            className="w-16 bg-[#0a1a32] rounded-lg text-center text-blue-300"
          />
        </label>

        <button
          onClick={handleStart}
          disabled={!isConnected || !isOwner}
          className="rounded-2xl px-6 py-3 font-extrabold text-xl shadow-inner uppercase
            bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-orange-700 text-brown-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar juego (owner)
        </button>

        <span className="pill bg-[#293059]/80 text-blue-200 font-bold px-5 py-2 rounded-xl shadow shadow-black/20 text-lg backdrop-blur-md">
          {game.turnLabel || "sin juego"}
        </span>
        <span className="pill bg-[#293059]/80 text-blue-200 font-bold px-5 py-2 rounded-xl shadow shadow-black/20 text-lg backdrop-blur-md">
          Sala: <b>{roomCode || "—"}</b> • Jugadores: <b>{playersCount}</b>
        </span>
      </div>

      {game.finished ? (
        <FinalResults board={game.finalBoard} ranking={game.ranking} onBack={handleBackToLobby} />
      ) : (
        <>
          {!game.round && (
            <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 mb-5">
              <h2 className="text-yellow-400 text-2xl font-extrabold">Esperando primer round…</h2>
              {!isOwner && <div className="small muted text-white">Espera a que el owner inicie la partida.</div>}
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