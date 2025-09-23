import * as signalR from "@microsoft/signalr";

export const SERVER_BASE = "http://26.155.73.119:5266/"; 

export const HUB_URL = SERVER_BASE + "hubs/game";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL) 
  .withAutomaticReconnect()
  .build();

// (opcional) helper para arrancar sin carreras
let startPromise: Promise<void> | null = null;
export async function ensureStarted() {
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    if (!startPromise) {
      startPromise = connection.start().catch(e => { startPromise = null; throw e; });
    }
    await startPromise;
  }
  return connection;
}

export default connection;
