export type Guid = string;

export type ScoreRowDto = {
    UserId?: Guid; userId?: Guid;
    Username?: string; username?: string;
    Score?: number; score?: number;
    AvgResponseMs?: number; avgResponseMs?: number;
    TotalCorrect?: number; totalCorrect?: number;
    TotalWrong?: number; totalWrong?: number;
  };