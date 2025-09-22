import * as React from "react";
import type { NewRoundDto } from "../types/newRoundDto";
import { gameSubmitAnswer } from "../services/gameService";
import { apiGetCurrentRound, apiGetRankingTop } from "../apiConfig/api";
import type { Guid } from "../types/chatDto";
import type { RankingRowDto } from "../types/rankingRowDto";

export function useGame(userId: Guid | null, roomCode: string | null) {
  const [round, setRound] = React.useState<NewRoundDto | null>(null);
  const [turnLabel, setTurnLabel] = React.useState("sin juego");
  const [canAnswer, setCanAnswer] = React.useState(false);

  // NUEVO: estados de fin de juego
  const [finished, setFinished] = React.useState(false);
  const [finalBoard, setFinalBoard] = React.useState<any[]>([]);
  const [ranking, setRanking] = React.useState<RankingRowDto[]>([]);

  const userRef = React.useRef<Guid | null>(userId);
  const roomRef = React.useRef<string | null>(roomCode);
  React.useEffect(() => { userRef.current = userId; }, [userId]);
  React.useEffect(() => { roomRef.current = roomCode; }, [roomCode]);

  const resetGame = React.useCallback(() => {
    setRound(null);
    setTurnLabel("nuevo juego");
    setCanAnswer(false);

    // limpiar resultados previos
    setFinished(false);
    setFinalBoard([]);
    setRanking([]);
  }, []);

  const handleNewRound = React.useCallback((data: any) => {
    const dto: NewRoundDto = {
      RoundId: data.RoundId ?? data.roundId,
      Word: data.Word ?? data.word,
      InkHex: data.InkHex ?? data.inkHex,
      Options: data.Options ?? data.options ?? [],
      RemainingForThisPlayer: data.RemainingForThisPlayer ?? data.remainingForThisPlayer ?? 0,
    };
    setRound(dto);
    setTurnLabel("jugando");
    setCanAnswer(true);
  }, []);

  const handleTurnChanged = React.useCallback((t: any) => {
    const uid = t?.UserId ?? t?.userId;
    const uname = t?.Username ?? t?.username ?? "alguien";
    const myId = userRef.current;
    if (myId && String(uid).toLowerCase() === String(myId).toLowerCase()) {
      setTurnLabel("tu turno: " + uname);
      setCanAnswer(true);
    } else {
      setTurnLabel("turno de: " + uname);
      setCanAnswer(false);
    }
  }, []);

  const handleScoreboard = React.useCallback((rows: any) => {
    // si quieres mostrar scoreboard incremental en el panel de la sala, puedes pasarlo al parent
    console.log("[useGame] Scoreboard:", rows);
  }, []);

  const handleWinner = React.useCallback((w: any) => {
    console.log("[useGame] Winner:", w);
  }, []);

  // ⬇️ Al terminar todas las rondas de todos, guardamos tablero final y pedimos ranking global
  const handleGameFinished = React.useCallback((rows: any[]) => {
    setTurnLabel("fin del juego");
    setCanAnswer(false);
    setFinished(true);
    setFinalBoard(rows || []);

    (async () => {
      try {
        const top = await apiGetRankingTop(10);
        setRanking(top || []);
      } catch {}
    })();
  }, []);

  // ⬇️ Fallback si se pierde "NewRound" tras responder
  const onAnswer = React.useCallback(
    async (optionId: number, rtSec: number) => {
      const rc = roomRef.current;
      const uid = userRef.current;
      if (!rc || !uid || !round) return;

      setCanAnswer(false);
      await gameSubmitAnswer(
        rc,
        uid,
        round.RoundId ?? (round as any).roundId,
        optionId,
        rtSec
      );

      setTimeout(async () => {
        try {
          const cur = await apiGetCurrentRound(rc);
          if (cur?.HasRound) {
            handleNewRound({
              RoundId: cur.RoundId,
              Word: cur.Word,
              InkHex: cur.InkHex,
              Options: cur.Options,
              RemainingForThisPlayer: cur.RemainingForThisPlayer,
            });
          }
        } catch {}
      }, 400);
    },
    [round, handleNewRound]
  );

  return {
    round,
    turnLabel,
    canAnswer,
    onAnswer,

    // handlers a enganchar desde GamePage
    resetGame,
    handleNewRound,
    handleTurnChanged,
    handleScoreboard,
    handleWinner,
    handleGameFinished,

    // NUEVO: datos finales
    finished,
    finalBoard,
    ranking,
  };
}
