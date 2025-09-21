// src/SignalRService/hub.ts
import connection, { ensureStarted } from "./connection";
import type { Guid } from "../types/chatDto";

export async function joinRoom(code: string, userId: Guid, username: string) {
  await ensureStarted();
  return connection.invoke("JoinRoom", code, userId, username);
}
export async function leaveRoom(code: string) {
  await ensureStarted();
  return connection.invoke("LeaveRoom", code);
}
export async function sendChat(code: string, userId: Guid, text: string) {
  await ensureStarted();
  return connection.invoke("SendChat", code, userId, text);
}
export async function startGame(code: string, rounds: number) {
  await ensureStarted();
  return connection.invoke("StartGame", code, rounds);
}
export async function submitAnswer(code: string, userId: Guid, roundId: number, optionId: number, rtSec: number) {
  await ensureStarted();
  return connection.invoke("SubmitAnswer", code, userId, roundId, optionId, rtSec);
}
