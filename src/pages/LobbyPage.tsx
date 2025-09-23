// src/pages/LobbyPage.tsx
import TopBar from "../components/TopBar";
import LobbyRoom from "../components/LobbyRoom";
import RoundsControl from "../components/RoundsControl";
import PlayersAndChat from "../components/PlayersAndChat";
import GamePage from "./GamePage"; // 👈 lo vamos a renderizar inline
import { useLobby } from "../hooks/useLobby";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import { SERVER_BASE } from "../SignalRService/connection";
import Ranking from "../components/Ranking";
import StroopSkyBG from "../components/bg/StroopSkyBG";

export default function LobbyPage() {
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
    returnToLobby,
  } = useLobby();

  const {
    roundsPerPlayer,
    setRoundsPerPlayer,
    starting,
    error,
    onStartGame,
  } = useWaitingRoom();

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
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-200">
      {/* Fondo animado */}
      <StroopSkyBG intensity={2} />
      <div
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto min-h-screen max-w-6xl p-4">
        <TopBar
          connLabel={isConnected ? "conectado" : "desconectado"}
          loginLabel={user.username ? "logueado: " + user.username : "sin login"}
          baseUrl={SERVER_BASE}
          onBaseUrl={() => {}}
        />

        {/* 👇 Si gameStarted es true, mostramos el juego inline */}
        {gameStarted ? (
          <>
            <GamePage onBack={returnToLobby} playersCount={players.length} />
            <div className="mt-4">
              <Ranking rows={scoreboard} />
            </div>
          </>
        ) : (
          <>
            {/* 1) Bloque crear/unirse */}
            {!isConnected && (
              <div className="py-14">
                {/* Título grande como en el ejemplo base */}
                <div className="mb-8 text-center">
                  <div
                    className="text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                    style={{ color: "#f59e0b" }}
                  >
                    STROOP GAME
                  </div>
                </div>

                {/* Mantiene la lógica: usamos el componente LobbyRoom */}
                <LobbyRoom
                  logged={user}
                  onCreateRoom={handleCreate}
                  onConnect={handleConnect}
                  onDisconnect={doDisconnect}
                  createdCode={createdCode}
                  canConnect={!!user?.id}
                  connected={isConnected}
                />
              </div>
            )}

            {/* 2) Sala de espera + chat */}
            {isConnected && (
              <>
                <div className="mb-6 flex items-center justify-between rounded-2xl border-4 border-[#0c1c36] bg-gradient-to-b from-[#0b1220] to-[#111827] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  <div>
                    <h2 className="text-lg font-bold text-slate-300">
                      Sala <b className="text-slate-100">{roomCode || "—"}</b>{" "}
                      {isOwner ? "(eres owner)" : ""}
                    </h2>
                    <span className="mt-2 inline-block rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
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

                <RoundsControl
                  value={roundsPerPlayer}
                  onChange={setRoundsPerPlayer}
                  onStart={handleStart}
                  disabled={!isConnected || starting}
                  isOwner={!!isOwner}
                />

                {starting && (
                  <div className="mt-4 rounded-2xl border-4 border-indigo-800/80 bg-indigo-100 px-4 py-3 font-bold text-indigo-900">
                    Iniciando partida…
                  </div>
                )}
                {!!error && (
                  <div className="mt-4 rounded-2xl border-4 border-rose-800/80 bg-rose-100 px-4 py-3 font-bold text-rose-900">
                    ⚠️ {error}
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
