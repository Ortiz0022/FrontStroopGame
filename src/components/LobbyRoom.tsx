import React from "react";

export default function LobbyRoom({
  logged, onCreateRoom, onConnect, onDisconnect,
  createdCode, canConnect, connected
}: any) {
  const [code, setCode] = React.useState("");

  return (
    <div className="card split-2">
      <div>
        <h2>1) Crear sala</h2>
        <button onClick={onCreateRoom} disabled={!logged.id}>Crear sala (owner = tú)</button>
        <div className="small">Código creado: <b>{createdCode ?? "—"}</b></div>
      </div>

      <div>
        <h2>2) Unirse</h2>
        <label>RoomCode:
          <input value={code} onChange={e=>setCode(e.target.value)} style={{width:120}} placeholder="12345" />
        </label>
        <button onClick={()=>onConnect(code)} disabled={!canConnect || !code || connected}>Conectar</button>
        <button onClick={onDisconnect} disabled={!connected}>Desconectar</button>
      </div>
    </div>
  );
}
