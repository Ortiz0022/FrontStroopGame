// src/pages/LobbyPage.tsx
import TopBar from "../components/TopBar";
import LobbyRoom from "../components/LobbyRoom";
import RoundsControl from "../components/RoundsControl";
import PlayersAndChat from "../components/PlayersAndChat";
import GamePage from "./GamePage";            // 👈 lo vamos a renderizar inline
import { useLobby } from "../hooks/useLobby";
import { useWaitingRoom } from "../hooks/useWaitingRoom";
import { SERVER_BASE } from "../SignalRService/connection";
import Ranking from "../components/Ranking";

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
    // 👇 agrega esta línea
    returnToLobby,
  } = useLobby();

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
    // ❌ sin navegación: GamePage se mostrará inline cuando llegue "GameStarted"
  };

  return (
    <div className="wrap">
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
         <Ranking rows={scoreboard} />
       </>
      ) : (
        <>
          {/* 1) Bloque crear/unirse (cuando NO estamos conectados) */}
          {!isConnected && (
            <LobbyRoom
              logged={user}
              onCreateRoom={handleCreate}
              onConnect={handleConnect}
              onDisconnect={doDisconnect}
              createdCode={createdCode}
              canConnect={!!user?.id}
              connected={isConnected}
            />
          )}

          {/* 2) Sala de espera + chat (cuando SÍ estamos conectados) */}
          {isConnected && (
            <>
              <div
                className="card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <h2>
                    Sala <b>{roomCode || "—"}</b> {isOwner ? "(eres owner)" : ""}
                  </h2>
                  <span className="pill">Sala de espera</span>
                </div>
                <button onClick={doDisconnect} disabled={!isConnected}>
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
                <div className="card small">
                  <div className="item">Iniciando partida…</div>
                </div>
              )}
              {!!error && (
                <div className="card small">
                  <div className="item">⚠️ {error}</div>
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
  );
}
