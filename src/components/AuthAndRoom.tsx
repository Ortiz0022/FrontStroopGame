import React from "react";
import type { Guid } from "../types/chatDto";


type Props = {
  logged: { id: Guid|null; username: string|null };
  onLogin: (username: string)=>void;
  onCreateRoom: ()=>void;
  onConnect: (code: string)=>void;
  onDisconnect: ()=>void;
  createdCode: string | null;
  canConnect: boolean; connected: boolean;
};

export default function AuthAndRoom({
  logged, onLogin, onCreateRoom, onConnect, onDisconnect,
  createdCode, canConnect, connected
}: Props){
  const [user, setUser] = React.useState("");
  const [code, setCode] = React.useState("");

  return (
    <div className="card split-3">
      <div>
        <h2>1) Login</h2>
        <label>Usuario:
          <input value={user} onChange={e=>setUser(e.target.value)} style={{width:220}} placeholder="tu nombre" />
        </label>
        <button onClick={()=>onLogin(user)} disabled={!user}>Iniciar sesión</button>
        <div className="small muted">{logged.username ? `logueado: ${logged.username}` : "sin login"}</div>
      </div>

      <div>
        <h2>2) Crear sala</h2>
        <button onClick={onCreateRoom} disabled={!logged.id}>Crear sala (owner = tú)</button>
        <div className="small">Código creado: <b>{createdCode ?? "—"}</b></div>
      </div>

      <div>
        <h2>3) Unirse</h2>
        <label>RoomCode:
          <input value={code} onChange={e=>setCode(e.target.value)} style={{width:120}} placeholder="12345" />
        </label>
        <button onClick={()=>onConnect(code)} disabled={!canConnect || !code || connected}>Conectar</button>
        <button onClick={onDisconnect} disabled={!connected}>Desconectar</button>
      </div>
    </div>
  );
}
