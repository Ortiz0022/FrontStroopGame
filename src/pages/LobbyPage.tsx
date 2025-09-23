// src/pages/LobbyPage.tsx
import * as React from "react";
import RoundsControl from "../components/RoundsControl";
import PlayersAndChat from "../components/PlayersAndChat";
import GamePage from "./GamePage"; // 👈 juego inline cuando inicia
import Ranking from "../components/Ranking";
import { useLobby } from "../hooks/useLobby";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import StroopSkyBG from "../components/bg/StroopSkyBG";

export default function LobbyPage() {
  // ======= LÓGICA (SE MANTIENE) =======
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
    returnToLobby, // 👈 necesario para volver desde GamePage
  } = useLobby();

  const {
    roundsPerPlayer,
    setRoundsPerPlayer,
    starting,
    error,
    onStartGame,
  } = useWaitingRoom();

  // ======= ESTADOS UI LOCALES =======
  const [joinCode, setJoinCode] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (txt: string) => {
    if (!txt) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(txt);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      // silencioso
    }
  };

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
    // 👇 Sin navegación: GamePage se muestra inline cuando llegue "GameStarted"
  };

  // ======= UI / ESTILO =======
  return (
    <div className="min-h-screen relative overflow-hidden text-slate-200">
      {/* Fondo animado tipo cielo */}
      <StroopSkyBG intensity={2} />

      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Si el juego ya inició, render inline */}
        {gameStarted ? (
          <>
            <GamePage onBack={returnToLobby} />
            <div className="mt-4">
              <Ranking rows={scoreboard} />
            </div>
          </>
        ) : (
          <>
            {/* 1) JOIN / CREATE (cuando NO estamos conectados) */}
            {!isConnected && (
              <div className="py-14">
                {/* Título */}
                <div className="text-center mb-8">
                  <div
                    className="text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                    style={{ color: "#f59e0b" }}
                  >
                    STROOP GAME
                  </div>
                </div>

                {/* Dos paneles */}
                <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  {/* JOIN A ROOM */}
                  <div className="rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 md:p-8">
                    <div className="text-center text-sky-300 font-extrabold tracking-wider text-2xl">
                      JOIN A ROOM
                    </div>

                    <div className="mt-5">
                      <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="ENTER ROOM CODE"
                        className="w-full rounded-2xl bg-[#0a1a32] border-2 border-[#1f3359] text-sky-200 px-5 py-4 tracking-widest text-center placeholder:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 text-lg"
                      />
                    </div>

                    <button
                      onClick={() => handleConnect(joinCode)}
                      disabled={!user?.id || !joinCode.trim()}
                      className="mt-5 w-full rounded-2xl px-6 py-4 text-xl font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(180deg,#ffa31a 0%,#ff8a00 80%)",
                        color: "#3b2100",
                        border: "2px solid #d06a00",
                        textShadow: "0 1px 0 rgba(255,255,255,.25)",
                      }}
                    >
                      JOIN
                    </button>
                  </div>

                  {/* CREATE A ROOM */}
                  <div className="rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 md:p-8">
                    <div className="text-center text-sky-300 font-extrabold tracking-wider text-2xl">
                      CREATE A ROOM
                    </div>

                    <button
                      onClick={handleCreate}
                      disabled={!user?.id}
                      className="mt-5 w-full rounded-2xl px-6 py-4 text-xl font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(180deg,#37a4ff 0%,#1f86e5 85%)",
                        color: "#021a33",
                        border: "2px solid #1661b8",
                        textShadow: "0 1px 0 rgba(255,255,255,.25)",
                      }}
                    >
                      CREATE
                    </button>

                    {/* Código creado + copiar */}
                    <div className="mt-5">
                      <div className="text-center text-slate-300 text-sm mb-2">
                        Código creado
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={createdCode ?? "—"}
                          className="flex-1 rounded-xl bg-[#0a1a32] border-2 border-[#1f3359] text-sky-200 px-4 py-3 tracking-widest text-center select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(createdCode ?? ""))}
                          disabled={!createdCode}
                          className="rounded-xl px-4 py-3 font-extrabold shadow-[inset_0_-3px_0_rgba(0,0,0,.2)] disabled:opacity-50"
                          style={{
                            background: "linear-gradient(180deg,#ffd166 0%,#ffb703 85%)",
                            color: "#3b2100",
                            border: "2px solid #d68a00",
                          }}
                          title="Copiar código"
                        >
                          Copy
                        </button>
                      </div>

                      {copied && (
                        <div className="mt-2 text-center text-emerald-300 text-sm font-bold">
                          ¡Código copiado!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2) SALA DE ESPERA + CHAT (cuando SÍ estamos conectados) */}
            {isConnected && (
              <>
                <div className="flex items-center justify-between bg-gradient-to-b from-[#0b1220] to-[#111827] border border-[#1f2937] rounded-2xl p-5 shadow-lg mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-300">
                      Sala <b className="text-slate-200">{roomCode || "—"}</b>{" "}
                      {isOwner ? "(eres owner)" : ""}
                    </h2>
                    <span className="inline-block mt-2 px-3 py-1 border border-slate-700 rounded-full text-xs text-slate-400">
                      Sala de espera
                    </span>
                  </div>

                  <button
                    onClick={doDisconnect}
                    disabled={!isConnected}
                    className="bg-green-500 text-green-950 px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Desconectar
                  </button>
                </div>

                <RoundsControl
                  value={roundsPerPlayer}
                  onChange={setRoundsPerPlayer}
                  onStart={handleStart}
                  disabled={!isConnected || starting}
                  isOwner={!!isOwner}
                />

                {starting && (
                  <div className="mt-4 bg-gradient-to-b from-[#0b1220] to-[#111827] border border-[#1f2937] rounded-2xl p-3 shadow-md text-xs text-slate-400">
                    <div className="border-b border-dashed border-slate-700 pb-2">
                      Iniciando partida…
                    </div>
                  </div>
                )}

                {!!error && (
                  <div className="mt-4 bg-gradient-to-b from-[#0b1220] to-[#111827] border border-[#1f2937] rounded-2xl p-3 shadow-md text-xs text-red-400">
                    <div className="border-b border-dashed border-slate-700 pb-2">
                      ⚠ {error}
                    </div>
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