import type { RoundOptionDto } from "./roundOptionDto";

export type NewRoundDto = {
  RoundId?: number; roundId?: number;
  Word?: string; word?: string;
  InkHex?: string; inkHex?: string;
  Options?: RoundOptionDto[]; options?: RoundOptionDto[];
  RemainingForThisPlayer?: number; remainingForThisPlayer?: number;

   CurrentPlayerUserId?: string; currentPlayerUserId?: string;
};
