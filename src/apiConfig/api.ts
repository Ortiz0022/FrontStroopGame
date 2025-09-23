import { SERVER_BASE } from "../SignalRService/connection";
import type { PlayerDto } from "../types/playerDto";
import type { ChatMsgDto, Guid } from "../types/chatDto";
import type { RankingRowDto } from "../types/rankingRowDto";

export function getBase() { return SERVER_BASE; }
// Mantengo la firma para compatibilidad, pero no hace nada aquí:
export function setBase(_url: string) { /* no-op */ }

async function j<T>(res: Response) {
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(()=>"")}`);
  return (await res.json()) as T;
}

// === Users ===
export async function apiLogin(username: string) {
  const r = await fetch(getBase() + "api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return j<{ status: "created" | "existing"; user: { id: Guid; username: string; createdAt: string } }>(r);
}

// === Rooms ===
export async function apiCreateRoom(creatorUserId: Guid) {
  const r = await fetch(getBase() + "api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creatorUserId),
  });
  return j<{ Id?: string; id?: string; Code?: string; code?: string; MinPlayers?: number; minPlayers?: number; MaxPlayers?: number; maxPlayers?: number }>(r);
}

export async function apiGetPlayers(code: string) {
  const r = await fetch(getBase() + `api/rooms/${encodeURIComponent(code)}/players`);
  return j<PlayerDto[]>(r);
}

export async function apiGetMessages(code: string, take = 50) {
  const r = await fetch(getBase() + `api/rooms/${encodeURIComponent(code)}/messages?take=${take}`);
  return j<ChatMsgDto[]>(r);
}

export async function apiReturnToLobby(code: string) {
  const r = await fetch(getBase() + `api/rooms/${encodeURIComponent(code)}/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return j<{ ok: boolean }>(r);
}

// === Ranking ===
export async function apiGetRankingTop(take = 10) {
  try {
    const r = await fetch(getBase() + `api/game/ranking/top?take=${take}`);
    if (!r.ok) return [] as RankingRowDto[];
    return j<RankingRowDto[]>(r);
  } catch { return []; }
}

// === Game ===
export async function apiGetCurrentRound(roomCode: string) {
  const r = await fetch(getBase() + `api/game/${encodeURIComponent(roomCode)}/round`);
  if (!r.ok) return { HasRound: false } as any;
  const data = await r.json();

  return {
    HasRound: data.HasRound ?? data.hasRound,
    RoundId:  data.RoundId  ?? data.roundId,
    Word:     data.Word     ?? data.word,
    InkHex:   data.InkHex   ?? data.inkHex,
    Options:  data.Options  ?? data.options ?? [],
    RemainingForThisPlayer:
      data.RemainingForThisPlayer ?? data.remainingForThisPlayer ?? 0,
  };
}
