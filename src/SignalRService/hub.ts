import type { Guid } from "../types/chatDto";
import * as signalR from "@microsoft/signalr";
import { getBase } from "../apiConfig/api";


export type Hub = signalR.HubConnection;

export function createHub(): Hub {
  return new signalR.HubConnectionBuilder()
    .withUrl(getBase() + "hubs/game", { withCredentials: true })
    .withAutomaticReconnect()
    .build();
}

export async function joinRoom(hub: Hub, code: string, userId: Guid, username: string) {
  await hub.invoke("JoinRoom", code, userId, username);
}
export async function leaveRoom(hub: Hub, code: string) {
  await hub.invoke("LeaveRoom", code);
}
export async function sendChat(hub: Hub, code: string, userId: Guid, text: string) {
  await hub.invoke("SendChat", code, userId, text);
}
export async function startGame(hub: Hub, code: string, rounds: number) {
  await hub.invoke("StartGame", code, rounds);
}
export async function submitAnswer(hub: Hub, code: string, userId: Guid, roundId: number, optionId: number, rtSec: number) {
  await hub.invoke("SubmitAnswer", code, userId, roundId, optionId, rtSec);
}
