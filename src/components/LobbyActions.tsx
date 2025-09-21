import React from "react";
import { useNavigate } from '@tanstack/react-router';
import { useGameController } from "../hooks/useGame";

export default function LobbyActions(){
  const gc = useGameController();
  const [code, setCode] = React.useState("");
  const nav = useNavigate();

  return (
    <div className="card split-3">
      <div>
        <h2>Crear sala</h2>
        <button onClick={async ()=>{ await gc.doCreateRoom(); }} disabled={!gc.user.id}>
          Crear (serás owner)
        </button>
        <div className="small">Código creado: <b>{gc.createdCode ?? "—"}</b></div>
        {gc.createdCode && (
          <button onClick={async ()=>{
            await gc.doConnect(gc.createdCode!);
            nav({to:"/game/room/$roomCode/wait", params:{roomCode: gc.createdCode!}});
          }}>Entrar a mi sala</button>
        )}
      </div>

      <div>
        <h2>Unirse a sala</h2>
        <label>RoomCode:
          <input value={code} onChange={e=>setCode(e.target.value)} style={{width:120}} />
        </label>
        <button onClick={async ()=>{
          await gc.doConnect(code);
          nav({to:"/game/room/$roomCode/wait", params:{roomCode: code}});
        }} disabled={!gc.user.id || !code}>Conectar</button>
      </div>

      <div>
        <h2>Acciones</h2>
        <button onClick={()=>nav({to:"/game/ranking"})}>Ver ranking</button>
      </div>
    </div>
  );
}
