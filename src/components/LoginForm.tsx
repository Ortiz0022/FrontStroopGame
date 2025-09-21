import React from "react";
import { useNavigate } from '@tanstack/react-router';
import { useGameController } from "../hooks/useGame";

export default function LoginForm(){
  const gc = useGameController();
  const [name, setName] = React.useState("");
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Login</h2>
      <label>Usuario:
        <input value={name} onChange={e=>setName(e.target.value)} style={{width:220}} />
      </label>
      <button
        onClick={async ()=>{ await gc.doLogin(name); navigate({to:"/game/lobby"}); }}
        disabled={!name}
      >
        Entrar
      </button>
      <div className="small muted">
        {gc.user.username ? `logueado: ${gc.user.username}` : "sin login"}
      </div>
    </div>
  );
}
