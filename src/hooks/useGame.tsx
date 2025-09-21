import React from "react";
import { useLocalState } from "../hooks/useLocalState";
import { createHub, joinRoom, leaveRoom, sendChat, startGame, submitAnswer } from "../SignalRService/hub";
import { apiCreateRoom, apiGetMessages, apiGetPlayers, apiGetRankingTop, apiLogin, setBase } from "../apiConfig/api";
import type { PlayerDto } from "../types/playerDto";
import type { ChatMsgDto } from "../types/chatDto";
import type { NewRoundDto } from "../types/newRoundDto";
import type { ScoreRowDto } from "../types/scoreRowDto";
import type { RankingRowDto } from "../types/rankingRowDto";

export function useGameController() {
  const [baseUrl, setBaseUrl] = useLocalState("stroob_base", import.meta.env.VITE_BACKEND_BASE ?? "https://1n21m23q-7121.use2.devtunnels.ms/");
  React.useEffect(()=> setBase(baseUrl), [baseUrl]);

  const [user, setUser] = useLocalState<{id:string|null; username:string|null}>("stroob_user", {id:null, username:null});
  const [createdCode, setCreatedCode] = React.useState<string|null>(null);
  const [roomCode, setRoomCode] = useLocalState<string>("stroob_room", "");
  const [isConnected, setConnected] = React.useState(false);
  const [isOwner, setOwner] = React.useState(false);

  const [players, setPlayers] = React.useState<PlayerDto[]>([]);
  const [chat, setChat] = React.useState<ChatMsgDto[]>([]);
  const [scoreboard, setScoreboard] = React.useState<ScoreRowDto[]>([]);
  const [ranking, setRanking] = React.useState<RankingRowDto[]>([]);

  const [turnLabel, setTurnLabel] = React.useState("sin juego");
  const [round, setRound] = React.useState<NewRoundDto|null>(null);
  const [canAnswer, setCanAnswer] = React.useState(false);
  const [roundsPerPlayer, setRoundsPerPlayer] = useLocalState<number>("stroob_rpp", 4);

  const hubRef = React.useRef<ReturnType<typeof createHub> | null>(null);

  React.useEffect(()=>{ apiGetRankingTop(10).then(setRanking); }, [baseUrl]);

  const doLogin = async (name: string) => {
    const res = await apiLogin(name);
    setUser({ id: res.user.id, username: res.user.username });
    setRanking(await apiGetRankingTop(10));
  };

  const doCreateRoom = async () => {
    if (!user.id) return alert("Primero inicia sesión");
    const r = await apiCreateRoom(user.id);
    const code = (r as any).Code ?? (r as any).code ?? "";
    setCreatedCode(code);
    setRoomCode(code);
  };

  const doConnect = async (code: string) => {
    if (!user.id || !user.username) return alert("Login primero");
    setRoomCode(code);
    const hub = createHub();
    hubRef.current = hub;

    hub.on("UserJoined", (p:any)=> setChat(c=>[...c, { username: p.username ?? p.Username, text: "entró a la sala" }]));
    hub.on("UserLeft",   (p:any)=> setChat(c=>[...c, { username: p.username ?? p.Username, text: "salió de la sala" }]));
    hub.on("RoomUpdated", (s:any) => {
      const list = s.Players ?? s.players ?? [];
      setPlayers(list);
      const me = list.find((x:any)=> (x.UserId ?? x.userId)?.toLowerCase?.() === user.id?.toLowerCase?.());
      setOwner(Boolean(me && (me.IsOwner ?? me.isOwner)));
    });
    hub.on("ChatHistory", (arr:any[]) => setChat(c=>[...c, ...(arr||[])] as any));
    hub.on("ChatMessage", (m:any) => setChat(c=>[...c, m]));

    hub.on("GameStarted", (_:any)=>{ setTurnLabel("juego iniciado"); setRound(null); });
    hub.on("TurnChanged", (t:any)=>{
      const uid = t.UserId ?? t.userId;
      const uname = t.Username ?? t.username ?? "alguien";
      if (uid?.toLowerCase?.() === user.id?.toLowerCase?.()){ setTurnLabel(`tu turno: ${uname}`); setCanAnswer(true); }
      else { setTurnLabel(`turno de: ${uname}`); setCanAnswer(false); }
    });
    hub.on("NewRound", (payload:NewRoundDto)=>{ setRound(payload); setCanAnswer(true); });
    hub.on("Scoreboard", (rows:ScoreRowDto[])=> setScoreboard(rows));
    hub.on("Winner", (w:any)=> setChat(c=>[...c, { username: "sistema", text: `🏆 ${(w.Username ?? w.username)} ganó con ${(w.Score ?? w.score)}` }]));
    hub.on("GameFinished", (rows:ScoreRowDto[])=>{ setScoreboard(rows); setTurnLabel("juego finalizado"); setCanAnswer(false); });

    hub.onreconnecting(()=>{});
    hub.onreconnected(()=>{});
    hub.onclose(()=>{ setConnected(false); setOwner(false); setCanAnswer(false); setTurnLabel("sin juego"); });

    await hub.start();
    await joinRoom(hub, code, user.id, user.username);
    setConnected(true);

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
    const rid = (round as any).RoundId ?? (round as any).roundId!;
    setCanAnswer(false);
    await submitAnswer(hubRef.current, roomCode, user.id, rid, optionId, rtSec);
  };

  return {
    baseUrl, setBaseUrl,
    user, createdCode, roomCode, isConnected, isOwner,
    players, chat, scoreboard, ranking,
    turnLabel, round, canAnswer, roundsPerPlayer, setRoundsPerPlayer,
    doLogin, doCreateRoom, doConnect, doDisconnect, onSendChat, onStartGame, onAnswer,
  };
}
