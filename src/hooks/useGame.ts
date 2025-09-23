import * as React from "react";
import type { NewRoundDto } from "../types/newRoundDto";
import { gameSubmitAnswer } from "../services/gameService";
import { apiGetCurrentRound, apiGetRankingTop } from "../apiConfig/api";
import type { Guid } from "../types/chatDto";
import type { RankingRowDto } from "../types/rankingRowDto";

function sameId(a?: Guid | null, b?: Guid | null) {
  if (!a || !b) return false;
  return String(a).toLowerCase() === String(b).toLowerCase();
}

export function useGame(userId: Guid | null, roomCode: string | null) {
  const [round, setRound] = React.useState<NewRoundDto | null>(null);
  const [turnLabel, setTurnLabel] = React.useState("sin juego");
  const [canAnswer, setCanAnswer] = React.useState(false);

  const [finished, setFinished] = React.useState(false);
  const [finalBoard, setFinalBoard] = React.useState<any[]>([]);
  const [ranking, setRanking] = React.useState<RankingRowDto[]>([]);

  const userRef = React.useRef<Guid | null>(userId);
  const roomRef = React.useRef<string | null>(roomCode);
  const turnUserRef = React.useRef<Guid | null>(null);

  React.useEffect(() => { userRef.current = userId; }, [userId]);
  React.useEffect(() => { roomRef.current = roomCode; }, [roomCode]);

  const resetGame = React.useCallback(() => {
    setRound(null);
    setTurnLabel("nuevo juego");
    setCanAnswer(false);
    setFinished(false);
    setFinalBoard([]);
    setRanking([]);
    turnUserRef.current = null;
  }, []);

  const handleNewRound = React.useCallback((data: any) => {
    const dto: NewRoundDto = {
      RoundId: data?.RoundId ?? data?.roundId,
      Word: data?.Word ?? data?.word,
      InkHex: data?.InkHex ?? data?.inkHex,
      Options: data?.Options ?? data?.options ?? [],
      RemainingForThisPlayer: data?.RemainingForThisPlayer ?? data?.remainingForThisPlayer ?? 0,
    };
    setRound(dto);
  
    const curPlayerId =
      data?.CurrentPlayerUserId ??
      data?.currentPlayerUserId ??
      turnUserRef.current;
    const me = userRef.current;
    const stillHas = (dto.RemainingForThisPlayer ?? 0) >= 0;
    setCanAnswer(!!me && !!curPlayerId && sameId(me, curPlayerId) && stillHas);
  }, []);

  const handleTurnChanged = React.useCallback((t: any) => {
    const uid = (t?.UserId ?? t?.userId) as Guid | null;
    const uname = t?.Username ?? t?.username ?? "alguien";
    turnUserRef.current = uid;

    const me = userRef.current;
    const isMine = sameId(me, uid);
    setTurnLabel(isMine ? "tu turno: " + uname : "turno de: " + uname);

    if (round) {
      const stillHas = (round.RemainingForThisPlayer ?? 0) >= 0;
      setCanAnswer(isMine && stillHas);
    } else {
      setCanAnswer(false);
    }
  }, [round]);

  const handleScoreboard = React.useCallback((rows: any) => {
    try { console.log("[useGame] Scoreboard:", rows); } catch {}
  }, []);

  const handleWinner = React.useCallback((w: any) => {
    try { console.log("[useGame] Winner:", w); } catch {}
  }, []);

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

  const onAnswer = React.useCallback(
    async (optionId: number, rtSec: number) => {
      const rc = roomRef.current;
      const uid = userRef.current;
      const r = round;
      if (!rc || !uid || !r) return;

      setCanAnswer(false); // deshabilita inmediatamente

      await gameSubmitAnswer(
        rc,
        uid,
        r.RoundId ?? (r as any).roundId,
        optionId,
        rtSec
      );

      // Fallback: NO re-habilita; solo trae el estado y handleNewRound decidirá
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
              CurrentPlayerUserId: cur.CurrentPlayerUserId, // si tu API lo devuelve
            });
          }
        } catch {}
      }, 250);
    },
    [round, handleNewRound]
  );

  return {
    round,
    turnLabel,
    canAnswer,
    onAnswer,

    resetGame,
    handleNewRound,
    handleTurnChanged,
    handleScoreboard,
    handleWinner,
    handleGameFinished,

    finished,
    finalBoard,
    ranking,
  };
}
