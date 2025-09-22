// src/hooks/useWaitingRoom.ts
import * as React from "react";
import { useLocalState } from "./useLocalState";
import { startGame } from "../SignalRService/hub";

export function useWaitingRoom() {
  const [roundsPerPlayer, setRoundsPerPlayer] = useLocalState<number>("stroob_rpp", 4);
  const [starting, setStarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onStartGame = React.useCallback(async (roomCode: string) => {
    setStarting(true);
    setError(null);
    try {
      const rounds = Math.max(1, Math.min(10, roundsPerPlayer));
      await startGame(roomCode, rounds);
    } catch (e: any) {
      setError(e?.message ?? "Error al iniciar el juego");
    } finally {
      setStarting(false);
    }
  }, [roundsPerPlayer]);

  return { roundsPerPlayer, setRoundsPerPlayer, starting, error, onStartGame };
}
