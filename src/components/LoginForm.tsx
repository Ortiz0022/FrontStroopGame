// src/components/LoginForm.tsx
import * as React from "react";

export default function LoginForm({
  onLogin,
  loggedLabel
}: {
  onLogin: (username: string) => Promise<any> | void;  // <-- aquí el fix
  loggedLabel?: string;
}) {
  const [username, setUsername] = React.useState("");

  return (
    <div className="card">
      <h2>1) Login</h2>
      <label>Usuario:
        <input
          value={username}
          onChange={e=>setUsername(e.target.value)}
          style={{ width: 220 }}
          placeholder="tu nombre"
        />
      </label>
      <button onClick={()=>onLogin(username)} disabled={!username}>
        Iniciar sesión
      </button>
      {!!loggedLabel && <div className="small muted">{loggedLabel}</div>}
    </div>
  );
}
