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
      {/* Cielo animado */}
      <StroopSkyBG intensity={2} />
      {/* Retícula/estrellas suaves */}
      <div
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Suelo decorativo al fondo (como la imagen) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:16px_16px] bg-[length:16px_16px]">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(12,22,53,0.9)_0%,rgba(9,18,40,0.98)_100%)] [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[#0b1b34]" />
      </div>

      <div className="mx-auto min-h-screen max-w-6xl p-4">
        <TopBar
          connLabel={isConnected ? "conectado" : "desconectado"}
          loginLabel={user.username ? "logueado: " + user.username : "sin login"}
          baseUrl={SERVER_BASE}
          onBaseUrl={() => {}}
        />

        {/* Juego inline cuando inicia */}
        {gameStarted ? (
          <>
            <GamePage onBack={returnToLobby} playersCount={players.length} />
            <div className="mt-4">
              <Ranking rows={scoreboard} />
            </div>
          </>
        ) : (
          <>
            {/* 1) Pantalla JOIN/CREATE (no conectado) */}
            {!isConnected && (
              <div className="py-14">
                {/* Título grande */}
                <div className="mb-10 text-center">
                  <div
                    className="text-6xl md:text-7xl font-extrabold tracking-wide drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]"
                    style={{ color: "#f59e0b" }}
                  >
                    STROOP GAME
                  </div>
                </div>

                {/* Contenedor central como la foto */}
                <div className="mx-auto max-w-5xl grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
                  {/* Usamos el mismo componente pero “neutralizamos” su borde externo
                      para que se vean DOS paneles separados como en la captura */}
                  <div className="[&>div]:border-0 [&>div]:bg-transparent [&>div]:shadow-none">
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
                </div>
              </div>
            )}

            {/* 2) Sala de espera + chat (conectado) */}
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
