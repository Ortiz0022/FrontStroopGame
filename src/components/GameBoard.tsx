import React from "react";
import type { RoundOptionDto } from "../types/roundOptionDto";
import type { NewRoundDto } from "../types/newRoundDto";

const COLOR_MAP: Record<number, string> = {
  1: "#FFFFFF",
  2: "#000000",
  3: "#FF0000",
  4: "#00FF00",
  5: "#0000FF"
};

function getId(o: RoundOptionDto) {
  return o.Id ?? o.id!;
}
function getColor(o: RoundOptionDto) {
  const cid = o?.ColorId ?? o?.colorId;
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
  onAnswer
}: Props) {
  const startRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (visible && round) {
      startRef.current = performance.now();
    }
  }, [visible, round]);

  if (!visible || !round) return null;

  const options = (round?.Options ?? round?.options ?? []) as RoundOptionDto[];

  // defensivo: si no hay al menos 2 opciones, no renderizamos
  if (options.length < 2) {
    return (
      <div className="card">
        <h2>Esperando opciones…</h2>
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
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>Juego (Stroop)</h2>
        <span className="pill">{turnLabel}</span>
      </div>

      <div className="game">
        <div
          className="word"
          style={{ color: round?.InkHex ?? round?.inkHex ?? "#cbd5e1" }}
        >
          {round?.Word ?? round?.word ?? "—"}
        </div>
        <div className="subtitle">
          Selecciona el color que <u>dice</u> la palabra
        </div>

        <div className="options">
          {o1 && (
            <button
              className="color-card"
              style={{ background: getColor(o1) }}
              disabled={!canAnswer}
              onClick={() => submit(o1)}
            />
          )}
          {o2 && (
            <button
              className="color-card"
              style={{ background: getColor(o2) }}
              disabled={!canAnswer}
              onClick={() => submit(o2)}
            />
          )}
        </div>

        <div className="row small" style={{ justifyContent: "space-between" }}>
          <div>
            Te quedan:{" "}
            <b>
              {round?.RemainingForThisPlayer ??
                round?.remainingForThisPlayer ??
                "—"}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
