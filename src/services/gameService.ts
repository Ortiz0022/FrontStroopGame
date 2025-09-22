import { submitAnswer } from "../SignalRService/hub";

/**
 * Enviar respuesta de StroopGame al backend
 */
export async function gameSubmitAnswer(
  roomCode: string,
  userId: string,
  roundId: number,
  optionId: number,
  rtSec: number
) {
  await submitAnswer(roomCode, userId, roundId, optionId, rtSec);
}
