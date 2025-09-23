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
      game.resetGame();   // limpia front
      onBack?.();         // notifica a LobbyPage (setGameStarted(false))
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
      try { connection.off("GameStarted", onGameStarted); } catch {}
      try { connection.off("TurnChanged", onTurnChanged); } catch {}
      try { connection.off("NewRound", onNewRound); } catch {}
      try { connection.off("Scoreboard", onScoreboard); } catch {}
      try { connection.off("Winner", onWinner); } catch {}
      try { connection.off("GameFinished", onFinished); } catch {}
    };
  }, [roomCode, game, setRoundsPerPlayer]);

  return (
    <div className="max-w-[1200px] mx-auto my-6 px-4 text-slate-200">
      {/* Header / controles (card) */}
      <div className="bg-gradient-to-b from-[#0b1220] to-[#111827] border border-[#1f2937] rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,.25)] flex flex-wrap items-center gap-3">
        <label className="inline-block my-2 mr-3 text-slate-400 text-sm">
          Rondas por jugador:
          <input
            type="number"
            min={1}
            max={10}
            value={roundsPerPlayer}
            readOnly
            className="w-[70px] ml-2 bg-[#0b1220] border border-[#253044] text-slate-200 px-2.5 py-2 rounded-[10px] placeholder:text-slate-500 focus:outline-none"
          />
        </label>

        <button
          onClick={handleStart}
          disabled={!isConnected || !isOwner}
          className="bg-emerald-500 text-[#052e16] px-3.5 py-2.5 rounded-[10px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar juego (owner)
        </button>

        <span className="inline-block px-2 py-0.5 border border-[#334155] rounded-full text-[12px] text-slate-400">
          {game.turnLabel}
        </span>
        <span className="inline-block px-2 py-0.5 border border-[#334155] rounded-full text-[12px] text-slate-400">
          Sala: <b>{roomCode || "—"}</b> • Jugadores: <b>{playersCount}</b>
        </span>
      </div>

      {/* Contenido */}
      {game.finished ? (
        <FinalResults board={game.finalBoard} ranking={game.ranking} onBack={handleBackToLobby}  />
      ) : (
        <>
          {!game.round && (
            <div className="bg-gradient-to-b from-[#0b1220] to-[#111827] border border-[#1f2937] rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,.25)] mt-4">
              <h2 className="m-0 mb-2 text-base font-bold text-slate-300">
                Esperando primer round…
              </h2>
              {!isOwner && (
                <div className="text-xs text-slate-400">
                  Espera a que el owner inicie la partida.
                </div>
              )}
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
// --- IGNORE ---