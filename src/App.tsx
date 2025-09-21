import React from "react";
import TopBar from "./components/TopBar";
import AuthAndRoom from "./components/AuthAndRoom";
import PlayersAndChat from "./components/PlayersAndChat";
import Ranking from "./components/Ranking";
import GameBoard from "./components/GameBoard";
import { useLocalState } from "./hooks/useLocalState";
import { createHub, joinRoom, leaveRoom, sendChat, startGame, submitAnswer } from "./SignalRService/hub";
import { apiCreateRoom, apiGetMessages, apiGetPlayers, apiGetRankingTop, apiLogin, setBase } from "./apiConfig/api";
import type { PlayerDto } from "./types/playerDto";
import type { ChatMsgDto } from "./types/chatDto";
import type { NewRoundDto } from "./types/newRoundDto";
import type { ScoreRowDto } from "./types/scoreRowDto";
import type { RankingRowDto } from "./types/rankingRowDto";

export default function App(){
  // configuración
  const [baseUrl, setBaseUrl] = useLocalState("stroob_base", import.meta.env.VITE_BACKEND_BASE ?? "https://9w8f8r2p-7121.use2.devtunnels.ms/");
  React.useEffect(()=> setBase(baseUrl), [baseUrl]);

  // sesión / sala
  const [user, setUser]   = useLocalState<{id:string|null; username:string|null}>("stroob_user", {id:null, username:null});
  const [createdCode, setCreatedCode] = React.useState<string|null>(null);
  const [roomCode, setRoomCode]       = useLocalState<string>("stroob_room", "");
  const [isConnected, setConnected]   = React.useState(false);
  const [isOwner, setOwner]           = React.useState(false);

  // UI
  const [players, setPlayers] = React.useState<PlayerDto[]>([]);
  const [chat, setChat]       = React.useState<ChatMsgDto[]>([]);
  const [scoreboard, setScoreboard] = React.useState<ScoreRowDto[]>([]);
  const [ranking, setRanking] = React.useState<RankingRowDto[]>([]);

  // juego
  const [turnLabel, setTurnLabel] = React.useState("sin juego");
  const [round, setRound] = React.useState<NewRoundDto|null>(null);
  const [canAnswer, setCanAnswer] = React.useState(false);
  const [roundsPerPlayer, setRoundsPerPlayer] = useLocalState<number>("stroob_rpp", 4);

  // hub
  const hubRef = React.useRef<ReturnType<typeof createHub> | null>(null);

  // cargar ranking al montar / al cambiar base
  React.useEffect(()=>{ apiGetRankingTop(10).then(setRanking); }, [baseUrl]);

  // handlers
  const doLogin = async (name: string) => {
    const res = await apiLogin(name);
    setUser({ id: res.user.id, username: res.user.username });
    setRanking(await apiGetRankingTop(10));
  };

  const doCreateRoom = async () => {
    if (!user.id) return alert("Primero inicia sesión");
    const r = await apiCreateRoom(user.id);
    const code = r.Code ?? r.code ?? "";
    setCreatedCode(code);
    setRoomCode(code);
  };

  const doConnect = async (code: string) => {
    if (!user.id || !user.username) return alert("Login primero");
    setRoomCode(code);
    const hub = createHub();
    hubRef.current = hub;

    // bind events
    hub.on("UserJoined", p => setChat(c=>[...c, { username: p.username ?? p.Username, text: "entró a la sala" }]));
    hub.on("UserLeft",   p => setChat(c=>[...c, { username: p.username ?? p.Username, text: "salió de la sala" }]));
    hub.on("RoomUpdated", s => {
      const list = s.Players ?? s.players ?? [];
      setPlayers(list);
      // owner?
      const me = list.find((x: { UserId: any; userId: any; }) => (x.UserId ?? x.userId)?.toLowerCase?.() === user.id?.toLowerCase?.());
      setOwner(Boolean(me && (me.IsOwner ?? me.isOwner)));
    });
    hub.on("ChatHistory", arr => setChat(c=>[...c, ...(arr||[])] as any));
    hub.on("ChatMessage", m => setChat(c=>[...c, m]));
    // game
    hub.on("GameStarted", _ => { setTurnLabel("juego iniciado"); setRound(null); });
    hub.on("TurnChanged", t => {
      const uid = t.UserId ?? t.userId;
      const uname = t.Username ?? t.username ?? "alguien";
      if (uid?.toLowerCase?.() === user.id?.toLowerCase?.()){
        setTurnLabel(`tu turno: ${uname}`); setCanAnswer(true);
      } else { setTurnLabel(`turno de: ${uname}`); setCanAnswer(false); }
    });
    hub.on("NewRound", payload => { setRound(payload); setCanAnswer(true); });
    hub.on("Scoreboard", rows => setScoreboard(rows));
    hub.on("Winner", w => setChat(c=>[...c, { username: "sistema", text: `🏆 ${w.Username ?? w.username} ganó con ${w.Score ?? w.score}` }]));
    hub.on("GameFinished", rows => { setScoreboard(rows); setTurnLabel("juego finalizado"); setCanAnswer(false); });

    hub.onreconnecting(()=>{/* opcional */});
    hub.onreconnected(()=>{/* opcional */});
    hub.onclose(()=>{ setConnected(false); setOwner(false); setCanAnswer(false); setTurnLabel("sin juego"); });

    await hub.start();
    await joinRoom(hub, code, user.id, user.username);
    setConnected(true);

    // snapshots
    setPlayers(await apiGetPlayers(code));
    setChat((await apiGetMessages(code, 50)) as any);
  };

  const doDisconnect = async () => {
    if (hubRef.current && roomCode) {
      try { await leaveRoom(hubRef.current, roomCode); } catch {}
      try { await hubRef.current.stop(); } catch {}
    }
    hubRef.current = null;
    setConnected(false);
    setOwner(false);
    setRound(null);
  };

  const onSendChat = async (txt: string) => {
    if (hubRef.current && roomCode && user.id) await sendChat(hubRef.current, roomCode, user.id, txt);
  };

  const onStartGame = async () => {
    if (!hubRef.current) return;
    await startGame(hubRef.current, roomCode, Math.max(1, Math.min(10, roundsPerPlayer)));
  };

  const onAnswer = async (optionId: number, rtSec: number) => {
    if (!hubRef.current || !user.id || !round) return;
    const rid = round.RoundId ?? round.roundId!;
    setCanAnswer(false);
    await submitAnswer(hubRef.current, roomCode, user.id, rid, optionId, rtSec);
  };

  return (
    <div className="wrap">
      <TopBar
        connLabel={isConnected ? "conectado" : "desconectado"}
        loginLabel={user.username ? `logueado: ${user.username}` : "sin login"}
        baseUrl={baseUrl}
        onBaseUrl={setBaseUrl}
      />

      <AuthAndRoom
        logged={user}
        onLogin={doLogin}
        onCreateRoom={doCreateRoom}
        onConnect={doConnect}
        onDisconnect={doDisconnect}
        createdCode={createdCode}
        canConnect={!!user.id}
        connected={isConnected}
      />

      {/* Juego */}
      <div className="card" style={{display:"flex", gap:12, alignItems:"center"}}>
        <label>Rondas por jugador:
          <input type="number" min={1} max={10} value={roundsPerPlayer} onChange={e=>setRoundsPerPlayer(parseInt(e.target.value||"4",10))} style={{width:70}}/>
        </label>
        <button onClick={onStartGame} disabled={!isConnected || !isOwner}>Iniciar juego (owner)</button>
        <span className="pill">{turnLabel}</span>
      </div>

      <GameBoard
        visible={true}
        round={round}
        turnLabel={turnLabel}
        canAnswer={canAnswer}
        onAnswer={onAnswer}
      />

      <PlayersAndChat
        players={players}
        scoreboard={scoreboard}
        chat={chat}
        canSend={isConnected}
        onSend={onSendChat}
      />

      <Ranking rows={ranking}/>
      <div className="card small"><b>Logs</b> <div className="list" style={{height:80}}><div className="item small">Si algo falla, abre la consola 😅</div></div></div>
    </div>
  );
}
