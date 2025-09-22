import { apiLogin, apiGetRankingTop } from "../apiConfig/api";
import type { RankingRowDto } from "../types/rankingRowDto";

export async function loginAndFetchRanking(username: string) {
  const res = await apiLogin(username); // { status, user:{ id, username, ... } }
  const rankingTop: RankingRowDto[] = await apiGetRankingTop(10);
  return { res, rankingTop };
}
