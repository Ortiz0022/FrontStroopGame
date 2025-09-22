import * as React from "react";
import { useLocalState } from "./useLocalState";
import connection from "../SignalRService/connection";
import { joinRoom, leaveRoom, sendChat } from "../SignalRService/hub";
import { apiCreateRoom, apiGetPlayers, apiGetCurrentRound } from "../apiConfig/api";

import type { Guid } from "../types/chatDto";
import type { PlayerDto } from "../types/playerDto";
import type { ChatMsgDto } from "../types/chatDto";
import type { ScoreRowDto } from "../types/scoreRowDto";

// Handlers del juego que nos pasa useGame
type GameHandlers = {
  onGameStarted?: () => void;
  onTurnChanged?: (t: any) => void;
  onNewRound?: (payload: any) => void;
  onScoreboard?: (rows: any) => void;
  onWinner?: (w: any) => void;
  onGameFinished?: (rows: any) => void;
};

export function useLobby(gameHandlers?: GameHandlers) {
  // sesión / sala
  const [user, setUser] = useLocalState<{ id: Guid | null; username: string | null }>(
    "stroob_user",
    { id: null, username: null }
  );
  const [createdCode, setCreatedCode] = React.useState<string | null>(null);
  const [roomCode, setRoomCode] = useLocalState<string>("stroob_room", "");
  const [isConnected, setConnected] = React.useState(false);
  const [isOwner, setOwner] = React.useState(false);

  // bandera para render inline del juego
  const [gameStarted, setGameStarted] = React.useState(false);

  const connectingRef = React.useRef<string | null>(null);

  // UI
  const [players, setPlayers] = React.useState<PlayerDto[]>([]);
  const [chat, setChat] = React.useState<ChatMsgDto[]>([]);
  const [scoreboard, setScoreboard] = React.useState<ScoreRowDto[]>([]);

  // cleanup de handlers
  const cleanupRef = React.useRef<null | (() => void)>(null);

  // ✅ Ref estable para handlers (evita capturar referencias viejas)
  const handlersRef = React.useRef<GameHandlers | undefined>(gameHandlers);
  React.useEffect(() => {
    handlersRef.current = gameHandlers;
  }, [gameHandlers]);

  // ✅ Cleanup global al desmontar (por si quedó algo pendiente)
  React.useEffect(() => {
    return () => {
      try { cleanupRef.current?.(); } catch {}
    };
  }, []);

  // acciones
  const doCreateRoom = React.useCallback(async () => {
    if (!user?.id) { alert("Primero inicia sesión"); return; }
    const r = await apiCreateRoom(user.id as any);
    const code = (r && (r.Code || r.code)) || "";
    setCreatedCode(code);
    setRoomCode(code);
  }, [user?.id, setRoomCode]);

  const doConnect = React.useCallback(async (code: string) => {
    if (!user?.id || !user?.username) { alert("Login primero"); return; }
    const room = String(code || "").trim();
    if (!room) { alert("Código de sala vacío"); return; }

    if (connectingRef.current === room) return;
    connectingRef.current = room;
    setRoomCode(room);
    setGameStarted(false); // por si veníamos de otra partida

    if (cleanupRef.current) { try { cleanupRef.current(); } catch {} }
    const evts = [
      "UserJoined","UserLeft","RoomUpdated",
      "ChatHistory","ChatMessage",
      "GameStarted","TurnChanged","NewRound",
      "Scoreboard","Winner","GameFinished",
    ];
    for (const e of evts) { try { (connection as any).off(e); } catch {} }

    // Handlers lobby
    const onUserJoined = (p: any) =>
      setChat(c => {
        const name = (p && (p.username || p.Username)) || "?";
        const last = c[c.length - 1];
        const dup  = last &&
          (last.username || (last as any).Username) === name &&
          (last.text || (last as any).Text) === "entró a la sala";
        return dup ? c : [...c, { username: name, text: "entró a la sala" }];
      });

    const onUserLeft = (p: any) =>
      setChat(c => [...c, { username: (p && (p.username || p.Username)) || "?", text: "salió de la sala" }]);

    const onRoomUpdated = (s: any) => {
      const list = (s && (s.Players || s.players)) || [];
      setPlayers(list as any[]);
      const ownerPlayer = (list as any[]).find(x => x.IsOwner === true || x.isOwner === true);
      const myId = String(user.id || "").toLowerCase();
      const ownerId = ownerPlayer
        ? String(ownerPlayer.UserId || ownerPlayer.userId || "").toLowerCase()
        : "";
      setOwner(myId === ownerId);
    };

    const onChatHistory = (arr: any[]) => setChat((arr || []) as any[]);
    const onChatMessage = (m: any) => setChat(c => [...c, m]);

    // Handlers del juego (desde ref estable)
    const onGameStarted = () => {
      setGameStarted(true);
      handlersRef.current?.onGameStarted?.();
    };

    const onTurnChanged = (...args: any[]) => {
      handlersRef.current?.onTurnChanged?.(args[0]);
    };

    const onNewRound = (...args: any[]) => {
      handlersRef.current?.onNewRound?.(args[0]);
    };

    const onScoreboard = (rows: any) => {
      setScoreboard(rows as any);
      handlersRef.current?.onScoreboard?.(rows);
    };

    const onWinner = (...args: any[]) => {
      handlersRef.current?.onWinner?.(args[0]);
    };

    const onGameFinished = (rows: any) => {
      handlersRef.current?.onGameFinished?.(rows);
      // podrías: setGameStarted(false);
    };

    connection.on("UserJoined", onUserJoined);
    connection.on("UserLeft", onUserLeft);
    connection.on("RoomUpdated", onRoomUpdated);
    connection.on("ChatHistory", onChatHistory);
    connection.on("ChatMessage", onChatMessage);

    // 🔔 GameStarted: flag y push de round actual (defensivo)
    connection.on("GameStarted", async () => {
      onGameStarted();
      try {
        const cur = await apiGetCurrentRound(room);
        if (cur?.HasRound) {
          onNewRound({
            RoundId: cur.RoundId,
            Word: cur.Word,
            InkHex: cur.InkHex,
            Options: cur.Options,
            RemainingForThisPlayer: cur.RemainingForThisPlayer
          });
        }
      } catch {}
    });

    connection.on("TurnChanged", onTurnChanged);
    connection.on("NewRound", onNewRound);
    connection.on("Scoreboard", onScoreboard);
    connection.on("Winner", onWinner);
    connection.on("GameFinished", onGameFinished);

    cleanupRef.current = () => {
      try { connection.off("UserJoined", onUserJoined); } catch {}
      try { connection.off("UserLeft", onUserLeft); } catch {}
      try { connection.off("RoomUpdated", onRoomUpdated); } catch {}
      try { connection.off("ChatHistory", onChatHistory); } catch {}
      try { connection.off("ChatMessage", onChatMessage); } catch {}

      try { connection.off("GameStarted"); } catch {}
      try { connection.off("TurnChanged", onTurnChanged); } catch {}
      try { connection.off("NewRound", onNewRound); } catch {}
      try { connection.off("Scoreboard", onScoreboard); } catch {}
      try { connection.off("Winner", onWinner); } catch {}
      try { connection.off("GameFinished", onGameFinished); } catch {}
    };

    try {
      const current = await apiGetPlayers(room);
      if (Array.isArray(current) && current.length > 4) {
        alert("La sala está llena, crea una nueva para poder jugar");
        connectingRef.current = null;
        return;
      }
    } catch {}

    try {
      await joinRoom(room, user.id as any, user.username as any);
    } catch (e: any) {
      const msg = String(e?.message || "").toLowerCase();
      if (msg.includes("llena") || msg.includes("full")) {
        alert("La sala está llena, crea una nueva para poder jugar");
      } else if (msg.includes("no existe") || msg.includes("not exist")) {
        alert("La sala no existe");
      } else {
        alert("No se pudo entrar a la sala");
      }
      if (cleanupRef.current) { try { cleanupRef.current(); } catch {} }
      connectingRef.current = null;
      return;
    }

    setConnected(true);
    setPlayers(await apiGetPlayers(room));
    connectingRef.current = null;
  }, [user?.id, user?.username, setRoomCode]);

  const doDisconnect = React.useCallback(async () => {
    try { if (cleanupRef.current) cleanupRef.current(); } catch {}
    if (roomCode) { try { await leaveRoom(roomCode); } catch {} }
    setConnected(false);
    setOwner(false);
    setPlayers([]);
    setChat([]);
    setScoreboard([]);
    setGameStarted(false);
  }, [roomCode]);

  const returnToLobby = React.useCallback(() => {
    setGameStarted(false);
  }, []);

  const onSendChat = React.useCallback(async (txt: string) => {
    if (!roomCode || !user?.id) return;
    await sendChat(roomCode, user.id as any, txt);
  }, [roomCode, user?.id]);

  // ✅ Efecto defensivo: si ya estamos conectados y la partida está iniciada,
  // intenta traer el round actual (por recarga o al llegar tarde)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isConnected || !roomCode || !gameStarted) return;
      try {
        const cur = await apiGetCurrentRound(roomCode);
        if (!cancelled && cur?.HasRound && handlersRef.current?.onNewRound) {
          handlersRef.current.onNewRound({
            RoundId: cur.RoundId,
            Word: cur.Word,
            InkHex: cur.InkHex,
            Options: cur.Options,
            RemainingForThisPlayer: cur.RemainingForThisPlayer
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [isConnected, roomCode, gameStarted]);

  return {
    user, setUser,
    createdCode, roomCode,
    isConnected, isOwner,
    players, chat, scoreboard,
    gameStarted,

    doCreateRoom,
    doConnect,
    doDisconnect,
    onSendChat,
    returnToLobby,
  };
}
