// import React from "react";
// import TopBar from "./components/TopBar";
// import AuthAndRoom from "./components/AuthAndRoom";
// import PlayersAndChat from "./components/PlayersAndChat";
// import Ranking from "./components/Ranking";
// import GameBoard from "./components/GameBoard";
// import { useLocalState } from "./hooks/useLocalState";

// import connection from "./SignalRService/connection";
// import { joinRoom, leaveRoom, sendChat, startGame, submitAnswer } from "./SignalRService/hub";
// import { SERVER_BASE } from "./SignalRService/connection";

// import { apiCreateRoom, apiGetMessages, apiGetPlayers, apiGetRankingTop, apiLogin } from "./apiConfig/api";

// import type { PlayerDto } from "./types/playerDto";
// import type { ChatMsgDto } from "./types/chatDto";
// import type { NewRoundDto } from "./types/newRoundDto";
// import type { ScoreRowDto } from "./types/scoreRowDto";
// import type { RankingRowDto } from "./types/rankingRowDto";
import { RouterProvider } from '@tanstack/react-router'
import { gameRouter } from "./router/router";


export function App() {

 return <RouterProvider router={gameRouter} />
  // // ❌ sin baseUrl en App
  // // sesión / sala
  // const [user, setUser] = useLocalState<{ id: string | null; username: string | null }>("stroob_user", { id: null, username: null });
  // const [createdCode, setCreatedCode] = React.useState<string | null>(null);
  // const [roomCode, setRoomCode] = useLocalState<string>("stroob_room", "");
  // const [isConnected, setConnected] = React.useState(false);
  // const [isOwner, setOwner] = React.useState(false);

  // // UI
  // const [players, setPlayers] = React.useState<PlayerDto[]>([]);
  // const [chat, setChat] = React.useState<ChatMsgDto[]>([]);
  // const [scoreboard, setScoreboard] = React.useState<ScoreRowDto[]>([]);
  // const [ranking, setRanking] = React.useState<RankingRowDto[]>([]);

  // // juego
  // const [turnLabel, setTurnLabel] = React.useState("sin juego");
  // const [round, setRound] = React.useState<NewRoundDto | null>(null);
  // const [canAnswer, setCanAnswer] = React.useState(false);
  // const [roundsPerPlayer, setRoundsPerPlayer] = useLocalState<number>("stroob_rpp", 4);

  // // cleanup de handlers del hub
  // const cleanupRef = React.useRef<null | (() => void)>(null);

  // // ranking al montar
  // React.useEffect(() => { apiGetRankingTop(10).then(setRanking); }, []);

  // // === handlers === (idénticos a los tuyos)
  // const doLogin = async (name: string) => {
  //   const res = await apiLogin(name);
  //   setUser({ id: res.user.id, username: res.user.username });
  //   setRanking(await apiGetRankingTop(10));
  // };

  // const doCreateRoom = async () => {
  //   if (!user.id) { alert("Primero inicia sesión"); return; }
  //   const r = await apiCreateRoom(user.id as any);
  //   const code = (r && (r.Code || r.code)) || "";
  //   setCreatedCode(code);
  //   setRoomCode(code);
  // };

  // const doConnect = async (code: string) => {
  //   if (!user.id || !user.username) { alert("Login primero"); return; }
  //   setRoomCode(code);

  //   if (cleanupRef.current) { try { cleanupRef.current(); } catch {} }

  //   const onUserJoined = (p: any) => setChat(c => [...c, { username: (p && (p.username || p.Username)) || "?", text: "entró a la sala" }]);
  //   const onUserLeft   = (p: any) => setChat(c => [...c, { username: (p && (p.username || p.Username)) || "?", text: "salió de la sala" }]);
  //   const onRoomUpdated = (s: any) => {
  //     const list = (s && (s.Players || s.players)) || [];
  //     setPlayers(list as any[]);
  //     const myId = String(user.id || "").toLowerCase();
  //     const me = (list as any[]).find(x => String((x && (x.UserId || x.userId)) || "").toLowerCase() === myId);
  //     const ownerFlag = me ? (me.IsOwner !== undefined ? me.IsOwner : (me && me.isOwner)) : false;
  //     setOwner(Boolean(ownerFlag));
  //   };
  //   const onChatHistory = (arr: any[]) => setChat(c => [...c, ...((arr || []) as any[])]);
  //   const onChatMessage = (m: any) => setChat(c => [...c, m]);
  //   const onGameStarted = () => { setTurnLabel("juego iniciado"); setRound(null); };
  //   const onTurnChanged = (t: any) => {
  //     const uid = t ? (t.UserId || t.userId) : "";
  //     const uname = t ? (t.Username || t.username || "alguien") : "alguien";
  //     if (String(uid).toLowerCase() === String(user.id || "").toLowerCase()) { setTurnLabel("tu turno: " + uname); setCanAnswer(true); }
  //     else { setTurnLabel("turno de: " + uname); setCanAnswer(false); }
  //   };
  //   const onNewRound = (payload: any) => { setRound(payload); setCanAnswer(true); };
  //   const onScoreboard = (rows: any) => setScoreboard(rows);
  //   const onWinner = (w: any) => setChat(c => [...c, { username: "sistema", text: "🏆 " + ((w && (w.Username || w.username)) || "?") + " ganó con " + ((w && (w.Score || w.score)) || "0") }]);
  //   const onGameFinished = (rows: any) => { setScoreboard(rows); setTurnLabel("juego finalizado"); setCanAnswer(false); };

  //   connection.on("UserJoined", onUserJoined);
  //   connection.on("UserLeft", onUserLeft);
  //   connection.on("RoomUpdated", onRoomUpdated);
  //   connection.on("ChatHistory", onChatHistory);
  //   connection.on("ChatMessage", onChatMessage);
  //   connection.on("GameStarted", onGameStarted);
  //   connection.on("TurnChanged", onTurnChanged);
  //   connection.on("NewRound", onNewRound);
  //   connection.on("Scoreboard", onScoreboard);
  //   connection.on("Winner", onWinner);
  //   connection.on("GameFinished", onGameFinished);

  //   cleanupRef.current = () => {
  //     try { connection.off("UserJoined", onUserJoined); } catch {}
  //     try { connection.off("UserLeft", onUserLeft); } catch {}
  //     try { connection.off("RoomUpdated", onRoomUpdated); } catch {}
  //     try { connection.off("ChatHistory", onChatHistory); } catch {}
  //     try { connection.off("ChatMessage", onChatMessage); } catch {}
  //     try { connection.off("GameStarted", onGameStarted); } catch {}
  //     try { connection.off("TurnChanged", onTurnChanged); } catch {}
  //     try { connection.off("NewRound", onNewRound); } catch {}
  //     try { connection.off("Scoreboard", onScoreboard); } catch {}
  //     try { connection.off("Winner", onWinner); } catch {}
  //     try { connection.off("GameFinished", onGameFinished); } catch {}
  //   };

  //   await joinRoom(code, user.id as any, user.username as any);
  //   setConnected(true);

  //   setPlayers(await apiGetPlayers(code));
  //   setChat((await apiGetMessages(code, 50)) as any);
  // };

  // const doDisconnect = async () => {
  //   try { if (cleanupRef.current) cleanupRef.current(); } catch {}
  //   if (roomCode) { try { await leaveRoom(roomCode); } catch {} }
  //   setConnected(false);
  //   setOwner(false);
  //   setRound(null);
  // };

  // const onSendChat = async (txt: string) => {
  //   if (!roomCode || !user.id) return;
  //   await sendChat(roomCode, user.id as any, txt);
  // };

  // const onStartGame = async () => {
  //   if (!roomCode) return;
  //   const rounds = Math.max(1, Math.min(10, roundsPerPlayer));
  //   await startGame(roomCode, rounds);
  // };

  // const onAnswer = async (optionId: number, rtSec: number) => {
  //   if (!user.id || !round || !roomCode) return;
  //   const rid = (round as any).RoundId !== undefined ? (round as any).RoundId : (round as any).roundId;
  //   setCanAnswer(false);
  //   await submitAnswer(roomCode, user.id as any, rid, optionId, rtSec);
  // };

  // return (
  //   <div className="wrap">
  //     <TopBar
  //       connLabel={isConnected ? "conectado" : "desconectado"}
  //       loginLabel={user.username ? "logueado: " + user.username : "sin login"}
  //       baseUrl={SERVER_BASE}          // ← solo lectura
  //       onBaseUrl={() => { /* no-op */}} // ← ya no editable desde UI
  //     />
  //     <AuthAndRoom
  //       logged={user}
  //       onLogin={doLogin}
  //       onCreateRoom={doCreateRoom}
  //       onConnect={doConnect}
  //       onDisconnect={doDisconnect}
  //       createdCode={createdCode}
  //       canConnect={!!user.id}
  //       connected={isConnected}
  //     />
  //     <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
  //       <label>Rondas por jugador:
  //         <input type="number" min={1} max={10} value={roundsPerPlayer}
  //                onChange={e => setRoundsPerPlayer(parseInt(e.target.value || "4", 10))}
  //                style={{ width: 70 }}/>
  //       </label>
  //       <button onClick={onStartGame} disabled={!isConnected || !isOwner}>Iniciar juego (owner)</button>
  //       <span className="pill">{turnLabel}</span>
  //     </div>
  //     <GameBoard visible={true} round={round} turnLabel={turnLabel} canAnswer={canAnswer} onAnswer={onAnswer} />
  //     <PlayersAndChat players={players} scoreboard={scoreboard} chat={chat} canSend={isConnected} onSend={onSendChat} />
  //     <Ranking rows={ranking} />
  //     <div className="card small"><b>Logs</b><div className="list" style={{ height: 80 }}><div className="item small">Si algo falla, abre la consola 😅</div></div></div>
  //   </div>
  // );
}
