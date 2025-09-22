import { apiCreateRoom, apiGetMessages, apiGetPlayers } from "../apiConfig/api";
import { joinRoom, leaveRoom, sendChat } from "../SignalRService/hub";
import type { Guid } from "../types/chatDto";

export async function createRoom(creatorUserId: Guid) {
  return apiCreateRoom(creatorUserId);
}

export async function connectToRoom(code: string, userId: Guid, username: string) {
  return joinRoom(code, userId, username);
}

export async function disconnectFromRoom(code: string) {
  return leaveRoom(code);
}

export async function fetchPlayers(code: string) {
  return apiGetPlayers(code);
}

export async function fetchMessages(code: string, take = 50) {
  return apiGetMessages(code, take);
}

export async function sendRoomChat(code: string, userId: Guid, text: string) {
  return sendChat(code, userId, text);
}
