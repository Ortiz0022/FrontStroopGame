import type { Guid } from "./chatDto";

export type LoginResp = {
    status: "created" | "existing";
    user: { id: Guid; username: string; createdAt: string };
  };