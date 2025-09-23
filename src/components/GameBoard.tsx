import React from "react";
import type { RoundOptionDto } from "../types/roundOptionDto";
import type { NewRoundDto } from "../types/newRoundDto";

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

  React.useEffect(() => {
    if (visible && round) startRef.current = performance.now();
  }, [visible, round]);

  if (!visible || !round) return null;

  const options = (round?.Options ?? (round as any)?.options ?? []) as RoundOptionDto[];
  if ((options?.length ?? 0) < 2) {
    return (
      <div className="card rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-slate-200">
        <h2 className="text-lg font-bold text-sky-300 tracking-wide">Esperando opciones…</h2>
      </div>
    );
  }

  const [o1, o2] = options;

  const submit = (opt: RoundOptionDto) => {
    if (!round || !canAnswer) return;
    const ms = performance.now() - startRef.current;
    onAnswer(getId(opt), Math.max(0, ms / 1000));
  };

  return (
    <div className="card rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-slate-200">
      {/* Header */}
      <div
        className="row flex items-center justify-between mb-6"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h2 className="text-xl font-extrabold tracking-wide text-sky-300 drop-shadow">Juego (Stroop)</h2>
        <span className="pill px-4 py-2 border-2 border-[#1f3359] rounded-full text-xs text-sky-300 tracking-widest">
          {turnLabel}
        </span>
      </div>

      {/* Cuerpo del juego */}
      <div className="game">
        {/* Palabra MUY visible */}
        <div
          className="word text-6xl md:text-7xl font-extrabold text-center mb-6 tracking-wider drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
          style={{ color: round?.InkHex ?? (round as any)?.inkHex ?? "#cbd5e1" }}
        >
          {round?.Word ?? (round as any)?.word ?? "—"}
        </div>

        <div className="subtitle text-center text-slate-400 text-lg mb-6">
          Selecciona el color que <u>dice</u> la palabra
        </div>

        {/* Opciones: color-card GRANDES y visibles */}
        <div className="options flex justify-center gap-8 mb-6">
          {o1 && (
            <button
              className="color-card w-40 h-40 md:w-52 md:h-52 rounded-2xl shadow-lg border-2 border-[#0c1c36] transform hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: getColor(o1) }}
              disabled={!canAnswer}
              onClick={() => submit(o1)}
            />
          )}
          {o2 && (
            <button
              className="color-card w-40 h-40 md:w-52 md:h-52 rounded-2xl shadow-lg border-2 border-[#0c1c36] transform hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: getColor(o2) }}
              disabled={!canAnswer}
              onClick={() => submit(o2)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="row small flex justify-between text-sm text-slate-400" style={{ justifyContent: "space-between" }}>
          <div>
            Te quedan:{" "}
            <b className="text-sky-300">
              {round?.RemainingForThisPlayer ?? (round as any)?.remainingForThisPlayer ?? "—"}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
