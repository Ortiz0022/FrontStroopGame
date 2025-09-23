import React from "react";

export default function LobbyRoom({
  logged, onCreateRoom, onConnect, onDisconnect,
  createdCode, canConnect, connected
}: any) {
  const [code, setCode] = React.useState("");

  return (
    <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {/* PANEL: JOIN / UNIRSE (como en la foto, panel oscuro con título centrado) */}
      <div className="rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="text-center text-sky-300 font-extrabold tracking-wider text-2xl uppercase">
          JOIN A ROOM
        </div>

        {/* Input grande centrado */}
        <label className="block mt-5">
          <div className="rounded-2xl border-2 border-[#1f3359] bg-[#0a1a32] px-5 py-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER ROOM CODE"
              className="w-full bg-transparent text-sky-200 placeholder:text-sky-500 tracking-widest text-center focus:outline-none"
              style={{ width: 120 }} // <- respeta tu ancho fijo original
            />
          </div>
        </label>

        {/* Botones: JOIN (naranja) + Disconnect (rojo) */}
        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => onConnect(code)}
            disabled={!canConnect || !code || connected}
            className="w-full rounded-2xl px-6 py-4 text-xl font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg,#ffa31a 0%,#ff8a00 80%)",
              color: "#3b2100",
              border: "2px solid #d06a00",
              textShadow: "0 1px 0 rgba(255,255,255,.25)",
            }}
          >
            JOIN
          </button>

          <button
            onClick={onDisconnect}
            disabled={!connected}
            className="w-full rounded-2xl border-2 border-rose-800/80 bg-gradient-to-b from-rose-500 to-rose-700 px-6 py-3 font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* PANEL: CREATE / CREAR SALA (azul, con “código creado”) */}
      <div className="rounded-2xl border-4 border-[#0c1c36] bg-[linear-gradient(180deg,#0b1b34_0%,#0f274b_100%)] p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="text-center text-sky-300 font-extrabold tracking-wider text-2xl uppercase">
          CREATE A ROOM
        </div>

        <button
          onClick={onCreateRoom}
          disabled={!logged?.id}
          className="mt-5 w-full rounded-2xl px-6 py-4 text-xl font-extrabold tracking-wide shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(180deg,#37a4ff 0%,#1f86e5 85%)",
            color: "#021a33",
            border: "2px solid #1661b8",
            textShadow: "0 1px 0 rgba(255,255,255,.25)",
          }}
        >
          CREATE
        </button>

        {/* Código creado (sin cambiar tu lógica: solo mostramos el valor) */}
        <div className="mt-5">
          <div className="text-center text-slate-300 text-sm mb-2">Código creado</div>

          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-[#0a1a32] border-2 border-[#1f3359] text-sky-200 px-4 py-3 tracking-widest text-center">
              {createdCode ?? "—"}
            </div>
            {/* No agrego botón “Copy” con lógica extra para respetar tu requisito.
                Si luego quieres, puedo añadirlo sin tocar el resto. */}
          </div>
        </div>
      </div>
    </div>
  );
}
