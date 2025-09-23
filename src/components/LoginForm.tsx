import * as React from "react";

export default function LoginForm({
  onLogin,
  
}: {
  onLogin: (username: string) => Promise<any> | void;
}) {
  const [username, setUsername] = React.useState("");

  return (
    <div
      className="
        card relative mx-auto w-[520px] max-w-[92vw]
        rounded-[28px] border-[6px] border-sky-400/90 bg-[#0D1F47]
        p-6 shadow-[0_20px_0_rgba(0,0,0,0.35),0_0_44px_rgba(14,165,233,0.25)]
      "
    >
      <div className="rounded-3xl border-[4px] border-[#0A1635] bg-[#0C1D41] p-6">
        <h2 className="mb-6 text-center text-5xl font-extrabold tracking-wider text-[#FFA726] drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]">
          LOGIN
        </h2>

        {/* === Tu estructura original (label + input) con clases === */}
        <label className="block mb-4 font-bold text-sky-200">
          Usuario:
          <div className="mt-2 rounded-2xl border-[4px] border-sky-700/70 bg-[#0E254F] px-4 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.05)]">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu nombre"
              className="w-full bg-transparent outline-none font-extrabold tracking-wide text-sky-300 placeholder:text-sky-400 caret-sky-300"
            />
          </div>
        </label>

        <button
          onClick={() => onLogin(username)}
          disabled={!username}
          className="
            relative w-full rounded-2xl border-[4px] border-[#8B2B00]
            bg-gradient-to-b from-[#FF7A00] to-[#FF3B00] py-3
            text-2xl font-extrabold tracking-wide text-yellow-100
            drop-shadow-[0_8px_0_rgba(0,0,0,0.4)]
            transition-transform active:translate-y-[3px] disabled:opacity-60
          "
        >
          <span className="relative z-[1]">LOGIN</span>
          <span className="pointer-events-none absolute inset-x-3 top-1 h-2 rounded-xl bg-white/35" />
        </button>

      </div>

      {/* Base decorativa inferior */}
      <div className="mt-4 grid grid-cols-5 gap-2 px-2 text-sky-300/30">
        <div className="col-span-3 h-4 rounded bg-sky-200/10" />
        <div className="h-4 rounded bg-sky-200/10" />
        <div className="h-4 rounded bg-sky-200/10" />
      </div>
    </div>
  );
}