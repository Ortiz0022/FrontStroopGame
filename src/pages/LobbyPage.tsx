// src/pages/LobbyPage.tsx
import * as React from "react";
import TopBar from "../components/TopBar";
import RoundsControl from "../components/RoundsControl";
import PlayersAndChat from "../components/PlayersAndChat";
import GamePage from "./GamePage";            // 👈 lo renderizamos inline cuando inicia
import { useLobby } from "../hooks/useLobby";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import { SERVER_BASE } from "../SignalRService/connection";
import Ranking from "../components/Ranking";
import StroopSkyBG from "../components/bg/StroopSkyBG";

export default function LobbyPage() {
  // useLobby SIN gameHandlers aquí (handlers van en GamePage)
  const {
    user,
    createdCode,
    roomCode,
    isConnected,
    isOwner,
    players,
    chat,
    scoreboard,
    gameStarted,
    doCreateRoom,
    doConnect,
    doDisconnect,
    onSendChat,
    // 👇 para volver del juego inline
    returnToLobby,
  } = useLobby();

  const {
    roundsPerPlayer,
    setRoundsPerPlayer,
    starting,
    error,
    onStartGame,
  } = useWaitingRoom();

  // ── Handlers existentes (no cambia lógica)
  const handleConnect = async (code: string) => {
    const codeStr = String(code || "").trim();
    if (!codeStr) return;
    await doConnect(codeStr);
  };

  const handleCreate = async () => {
    await doCreateRoom();
  };

  const handleStart = async () => {
    if (!roomCode) return;
    if (players.length < 2) {
      alert("Necesitas al menos 2 jugadores para iniciar la partida");
      return;
    }
    await onStartGame(roomCode);
    // ❌ sin navegación: GamePage se mostrará inline cuando llegue "GameStarted"
  };

  // ── Estado SOLO de UI para el panel de “join” (no altera tu lógica)
  const [joinCode, setJoinCode] = React.useState("");

  return (
    <div className="min-h-screen relative overflow-hidden text-slate-200">
      {/* Cielo nocturno (bg) */}
      <StroopSkyBG intensity={2}/>
      <div
      />
      {/* Estrellas sutiles */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.6) 60%, transparent 61%), radial-gradient(1.5px 1.5px at 70% 20%, rgba(255,255,255,.6) 60%, transparent 61%), radial-gradient(1.8px 1.8px at 40% 70%, rgba(255,255,255,.6) 60%, transparent 61%), radial-gradient(1.2px 1.2px at 85% 60%, rgba(255,255,255,.6) 60%, transparent 61%)",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Wrapper */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* 👇 Si el juego ya inició, se muestra inline */}
        {gameStarted ? (
          <>
            <GamePage onBack={returnToLobby} />
            <div className="mt-4">
              <Ranking rows={scoreboard} />
            </div>
          </>
        ) : (
          <>
            {/* ─────────────────────────────────────────────────────────────
                1) PANTALLA “JOIN / CREATE” (cuando NO estamos conectados)
                ───────────────────────────────────────────────────────────── */}
            {!isConnected && (
              <div className="py-10">
                {/* Título */}
                <div className="text-center mb-6">
                  <div                     className="text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                      style={{ color: "#f59e0b" }}>
                    STROOP GAME
                  </div>
                </div>

                {/* Contenedor Flex para los paneles de Join y Create */}
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  {/* JOIN A ROOM */}
                  <div className="flex-1 rounded-xl border-2 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-4">
                    <div className="text-center text-sky-300 font-bold tracking-wider text-lg">
                      JOIN A ROOM
                    </div>

                    <div className="mt-3">
                      <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="ENTER ROOM CODE"
                        className="w-full rounded-xl bg-[#0a1a32] border-2 border-[#1f3359] text-sky-200 px-4 py-3 tracking-widest text-center placeholder:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <button
                      onClick={() => handleConnect(joinCode)}
                      disabled={!user?.id || !joinCode.trim()}
                      className="mt-4 w-full rounded-xl px-5 py-3 font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(180deg,#ffa31a 0%,#ff8a00 80%)",
                        color: "#3b2100",
                        border: "2px solid #d06a00",
                        textShadow: "0 1px 0 rgba(255,255,255,.25)",
                      }}
                    >
                      JOIN
                    </button>
                  </div>

                  {/* CREATE A ROOM */}
                  <div className="flex-1 rounded-xl border-2 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-4">
                    <div className="text-center text-sky-300 font-bold tracking-wider text-lg">
                      CREATE A ROOM
                    </div>

                    <button
                      onClick={handleCreate}
                      disabled={!user?.id}
                      className="mt-4 w-full rounded-xl px-5 py-3 font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(180deg,#37a4ff 0%,#1f86e5 85%)",
                        color: "#021a33",
                        border: "2px solid #1661b8",
                        textShadow: "0 1px 0 rgba(255,255,255,.25)",
                      }}
                    >
                      CREATE
                    </button>

                    {/* Si ya se creó código, lo mostramos */}
                    <div className="text-xs text-slate-400 mt-3 text-center">
                      Código creado:{" "}
                      <b className="text-slate-200">{createdCode ?? "—"}</b>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
           {isConnected && (
  <>
    <div className="mb-6 flex items-center justify-between rounded-2xl border-4 border-cyan-300 bg-gradient-to-b from-[#0b1220] to-[#111827] px-5 py-4 shadow-2xl">
      <div>
        <h2 className="text-lg font-extrabold text-yellow-400 drop-shadow-[2px_3px_0_rgba(0,0,0,0.7)]">
          Sala <b className="text-yellow-200">{roomCode || "—"}</b>{" "}
          {isOwner ? "(eres owner)" : ""}
        </h2>
        <span className="mt-2 inline-block rounded-full border border-slate-700 px-3 py-1 text-xs text-blue-300">
          Sala de espera
        </span>
      </div>

      <button
        onClick={doDisconnect}
        disabled={!isConnected}
        className="rounded-xl border-2 border-rose-800/80 bg-gradient-to-b from-rose-500 to-rose-700 px-5 py-2 font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.3)] disabled:opacity-50"
      >
        Desconectar
      </button>
    </div>

   <div className="mb-6 flex items-center justify-between rounded-2xl border-4 border-cyan-300 bg-gradient-to-b from-[#0b1220] to-[#111827] px-5 py-4 shadow-2xl">
  <RoundsControl
    value={roundsPerPlayer}
    onChange={setRoundsPerPlayer}
    onStart={handleStart}
    disabled={!isConnected || starting}
    isOwner={!!isOwner}
  />
</div>


    {starting && (
      <div className="mt-4 rounded-2xl border-4 border-indigo-800/80 bg-indigo-100 px-4 py-3 font-bold text-indigo-900">
        Iniciando partida…
      </div>
    )}
    {!!error && (
      <div className="mt-4 rounded-2xl border-4 border-rose-800/80 bg-rose-100 px-4 py-3 font-bold text-rose-900">
        ⚠ {error}
      </div>
    )}

    <PlayersAndChat
      players={players}
      chat={chat}
      scoreboard={scoreboard}
      canSend={isConnected}
      onSend={onSendChat}
    />
  </>
)}



          </>
        )}
      </div>
    </div>
  );
}