// src/pages/WaitingRoomPage.tsx
import * as React from "react";
import RoundsControl from "../components/RoundsControl";
import PlayersAndChat from "../components/PlayersAndChat";

type Props = {
  roomCode: string;
  isConnected: boolean;
  isOwner: boolean;
  players: any[];
  chat: any[];
  scoreboard: any[];
  roundsPerPlayer: number;
  setRoundsPerPlayer: (n: number) => void;
  starting: boolean;
  error: string | null;
  onStart: () => void;
  onDisconnect: () => void;
  onSendChat: (txt: string) => void;
};

export default function WaitingRoomPageView({
  roomCode,
  isConnected,
  isOwner,
  players,
  chat,
  scoreboard,
  roundsPerPlayer,
  setRoundsPerPlayer,
  starting,
  error,
  onStart,
  onDisconnect,
  onSendChat,
}: Props) {
  return (
    <>
      <div
        className="card"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div>
          <h2>
            Sala <b>{roomCode || "—"}</b> {isOwner ? "(eres owner)" : ""}
          </h2>
          <span className="pill">{isConnected ? "Sala de espera" : "Sin sala"}</span>
        </div>
        <button onClick={onDisconnect} disabled={!isConnected}>
          Desconectar
        </button>
      </div>

      <RoundsControl
        value={roundsPerPlayer}
        onChange={setRoundsPerPlayer}
        onStart={onStart}
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
  );
}
