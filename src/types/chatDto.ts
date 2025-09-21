export type Guid = string;

export type ChatMsgDto = {
  UserId?: Guid; userId?: Guid;
  Username?: string; username?: string;
  Text?: string; text?: string;
  sentAt?: string | Date;
};
