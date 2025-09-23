import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";
import StroopSkyBG from "../components/bg/StroopSkyBG";

export default function LoginPage() {
  const { user, loading, error, doLogin } = useLogin();
  const navigate = useNavigate();

  const loggedLabel = user.username ? `logueado: ${user.username}` : "sin login";

  const handleLogin = async (username: string) => {
    await doLogin(username);
    navigate({ to: "/game/lobby" });
  };

  return (
    <div className="wrap">
      <StroopSkyBG intensity={2} />
      <div className="card row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <h1>StroobGame • Login</h1>
        <span className="pill">{loggedLabel}</span>
      </div>

      <LoginForm onLogin={handleLogin} loggedLabel={loggedLabel} />

      {loading && (
        <div className="card small">
          <div className="item">Iniciando sesión...</div>
        </div>
      )}
      {!!error && (
        <div className="card small">
          <div className="item">⚠️ {error}</div>
        </div>
      )}
    </div>
  );
}
