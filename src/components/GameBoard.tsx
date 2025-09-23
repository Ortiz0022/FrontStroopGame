import React from "react";
import type { RoundOptionDto } from "../types/roundOptionDto";
import type { NewRoundDto } from "../types/newRoundDto";
import { useLobby } from "../hooks/useLobby";

const COLOR_MAP: Record<number, string> = {
  1: "#FFFFFF",
  2: "#000000",
  3: "#FF0000",
  4: "#00FF00",
  5: "#0000FF",
};

function getId(o: RoundOptionDto) {
  return o.Id ?? (o as any).id!;
}
function getColor(o: RoundOptionDto) {
  const cid = o?.ColorId ?? (o as any)?.colorId;
  return COLOR_MAP[cid ?? 0] ?? "#111827";
}

// 🔐 normalizador de IDs
function normId(v: unknown) {
  return v == null ? "" : String(v).trim().toLowerCase();
}

type Props = {
  visible: boolean;
  round: NewRoundDto | null;
  turnLabel: string;
  canAnswer: boolean;
  onAnswer: (optionId: number, rtSec: number) => void;
};

export default function GameBoard({
  visible,
  round,
  turnLabel,
  canAnswer,
  onAnswer,
}: Props) {
  const startRef = React.useRef<number>(0);
  const clickedRef = React.useRef(false);
  const { user } = useLobby();

  React.useEffect(() => {
    if (visible && round) startRef.current = performance.now();
  }, [visible, round]);

  // cuando cambia el round, desbloqueamos el click
  React.useEffect(() => {
    clickedRef.current = false;
  }, [round]);

  if (!visible || !round) return null;

  const options = (round?.Options ?? (round as any)?.options ?? []) as RoundOptionDto[];
  if ((options?.length ?? 0) < 2) {
    return (
      <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 mb-5">
        <h2 className="text-yellow-400 text-2xl font-extrabold">
          Esperando opciones…
        </h2>
      </div>
    );
  }

  const [o1, o2] = options;

  // 🧠 mi id y el id del turno actual
  const myId = normId((user as any)?.id ?? (user as any)?.Id ?? (user as any)?.userId);
  const currentTurnUserId = normId(
    (round as any)?.CurrentPlayerUserId ?? (round as any)?.currentPlayerUserId
  );

  // ✅ habilitado si el hook dice que sí o si el backend manda mi turno
  const effectiveCanAnswer = Boolean(
    canAnswer || (currentTurnUserId && myId && myId === currentTurnUserId)
  );

  const submit = (opt: RoundOptionDto) => {
    if (!round || !effectiveCanAnswer || clickedRef.current) return;
    clickedRef.current = true;
    const ms = performance.now() - startRef.current;
    onAnswer(getId(opt), Math.max(0, ms / 1000));
  };

  return (
    <div className="card border-4 border-cyan-300 bg-[#172144] rounded-3xl shadow-2xl p-7 mb-5">
      <div className="row flex justify-between items-center mb-4">
        <h2 className="text-yellow-500 font-extrabold text-2xl">Juego (Stroop)</h2>
        <span className="pill bg-[#293059]/80 text-blue-200 font-bold px-5 py-2 rounded-xl shadow shadow-black/20 text-lg backdrop-blur-md">
          {turnLabel}
        </span>
      </div>

      <div className="game text-center">
        <div
          className="word font-extrabold text-white text-6xl mb-2"
          style={{
            color:
              (round as any)?.InkHex ??
              (round as any)?.inkHex ??
              "#cbd5e1",
          }}
        >
          {(round as any)?.Word ?? (round as any)?.word ?? "—"}
        </div>
        <div className="subtitle text-slate-300 mb-7">
          Selecciona el color que <u>dice</u> la palabra
        </div>

        <div className="options flex gap-7 justify-center mb-6">
          {o1 && (
            <button
              className="color-card w-28 h-28 rounded-2xl outline-none border-4 border-[#35436a] shadow-[0_8px_24px_rgba(0,0,0,.25)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: getColor(o1) }}
              disabled={!effectiveCanAnswer}
              onClick={() => submit(o1)}
            />
          )}
          {o2 && (
            <button
              className="color-card w-28 h-28 rounded-2xl outline-none border-4 border-[#35436a] shadow-[0_8px_24px_rgba(0,0,0,.25)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: getColor(o2) }}
              disabled={!effectiveCanAnswer}
              onClick={() => submit(o2)}
            />
          )}
        </div>

        <div className="row flex justify-between text-sm text-slate-400">
          <div>
            Te quedan:{" "}
            <b className="text-white">
              {(round as any)?.RemainingForThisPlayer ??
                (round as any)?.remainingForThisPlayer ??
                "—"}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
