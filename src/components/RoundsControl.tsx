import React from "react";

export default function RoundsControl({
  value,
  onChange,
  onStart,
  disabled,
  isOwner,
}: {
  value: number;
  onChange: (n: number) => void;
  onStart: () => void;
  disabled: boolean;
  isOwner: boolean;
}) {
  return (
    <div
      className=" bg-gradient-to-b from-[#0b1220] to-[#111827] rounded-3xl shadow-2xl p-6 flex flex-wrap items-center gap-4 max-w-md"
    >
      <label className="flex items-center font-bold text-yellow-400 gap-3">
        Rondas por jugador:
        <input
          type="number"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value || "4", 10))}
          className="w-16 text-center bg-[#0a1a32] rounded-lg text-blue-300"
        />
      </label>
      <button
        onClick={onStart}
        disabled={disabled || !isOwner}
        className="rounded-xl border-2 shadow-[inset_0_-3px_0_rgba(0,0,0,0.3)] px-6 py-3 font-extrabold tracking-wide text-xl uppercase disabled:opacity-50 disabled:cursor-not-allowed
          bg-gradient-to-b from-orange-400 to-orange-600 border-orange-700 text-brown-900"
      >
        Iniciar juego (owner)
      </button>

      {!isOwner && (
        <span className="pill bg-[#293059]/80 text-blue-200 font-bold px-5 py-2 rounded-xl shadow shadow-black/20 text-lg backdrop-blur-md">
          Esperando al owner…
        </span>
      )}
    </div>
  );
}