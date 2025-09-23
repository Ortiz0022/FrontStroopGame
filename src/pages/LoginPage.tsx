import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";
import StroopSkyBG from "../components/bg/StroopSkyBG";


export default function LoginPage() {
  const { user, loading, error, doLogin } = useLogin();
  const navigate = useNavigate();


  const handleLogin = async (username: string) => {
    await doLogin(username);
    navigate({ to: "/game/lobby" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden sky-safe">
      {/* Fondo cielo cuadriculado (Tailwind v4 ok) */}
      < StroopSkyBG intensity={2} />
      <div
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto min-h-screen max-w-6xl p-4">
        {/* Header tipo panel */}
        <div className="mb-6 flex items-center justify-between rounded-2xl px-5 py-3 ">
        </div>

        {/* Form centrado (misma lógica) */}
        <div className="flex justify-center">
          <LoginForm onLogin={handleLogin}  />
        </div>

        {/* Estados (sin cambios) */}
        {loading && (
          <div className="mt-4 rounded-2xl border-4 border-indigo-900/60 bg-indigo-100 px-4 py-3 font-bold text-indigo-900">
            Iniciando sesión...
          </div>
        )}
        {!!error && (
          <div className="mt-3 rounded-2xl border-4 border-rose-800/70 bg-rose-100 px-4 py-3 font-bold text-rose-900">
            ⚠ {error}
          </div>
        )}
      </div>
    </div>
  );

}
