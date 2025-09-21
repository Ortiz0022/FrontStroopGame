import { useParams, useNavigate } from '@tanstack/react-router'
import PlayersAndChat from "../components/PlayersAndChat";
import { useGameController } from "../hooks/useGame";

export default function WaitingRoomPanel(){
  const gc = useGameController();
  const { roomCode } = useParams({ from: '/game/room/$roomCode/wait' });
  const nav = useNavigate();

  return (
    <>
      <div className="card row" style={{alignItems:"center", gap:12}}>
        <b>Sala:</b> <span className="pill">{roomCode}</span>
        <span className="pill">{gc.isConnected ? "conectado" : "desconectado"}</span>
        <button onClick={gc.doDisconnect} disabled={!gc.isConnected}>Desconectar</button>

        <label style={{marginLeft:"auto"}}>Rondas por jugador:
          <input type="number" min={1} max={10} value={gc.roundsPerPlayer}
                 onChange={e=>gc.setRoundsPerPlayer(parseInt(e.target.value||"4",10))}
                 style={{width:70, marginLeft:6}}/>
        </label>

        <button onClick={async ()=>{
          await gc.onStartGame();
          nav({to:"/game/room/$roomCode/play", params:{roomCode}});
        }} disabled={!gc.isConnected || !gc.isOwner}>
          Iniciar juego (owner)
        </button>
      </div>

      <PlayersAndChat
        players={gc.players}
        scoreboard={gc.scoreboard}
        chat={gc.chat}
        canSend={gc.isConnected}
        onSend={gc.onSendChat}
      />
    </>
  );
}
