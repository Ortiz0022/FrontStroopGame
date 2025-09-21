import { useParams, Link } from '@tanstack/react-router'
import GameBoard from "../components/GameBoard";
import PlayersAndChat from "../components/PlayersAndChat";
import { useGameController } from "../hooks/useGame";

export default function GamePanel(){
  const gc = useGameController();
  const { roomCode } = useParams({ from: '/game/room/$roomCode/play' });

  return (
    <>
      <div className="card row" style={{alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <b>Sala:</b> <span className="pill">{roomCode}</span>
          <span className="pill" style={{marginLeft:8}}>{gc.turnLabel}</span>
        </div>
        <div className="row" style={{gap:8}}>
          <Link className="button" to="/game/room/$roomCode/wait" params={{roomCode}}>
            Volver a sala
          </Link>
        </div>
      </div>

      <GameBoard
        visible={true}
        round={gc.round}
        turnLabel={gc.turnLabel}
        canAnswer={gc.canAnswer}
        onAnswer={gc.onAnswer}
      />

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
