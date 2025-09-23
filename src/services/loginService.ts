import { apiLogin, apiGetRankingTop } from "../apiConfig/api";
import type { RankingRowDto } from "../types/rankingRowDto";

export async function loginAndFetchRanking(username: string) {
  const res = await apiLogin(username); // { status, user:{ id, username, ... } }

  // ✅ Guardar el usuario para que useLobby lo lea con useSessionState(...)
  if (res?.user?.id && res?.user?.username) {
    sessionStorage.setItem(
      "stroob_user",
      JSON.stringify({ id: res.user.id, username: res.user.username })
    );
  }

  const rankingTop: RankingRowDto[] = await apiGetRankingTop(10);
  return { res, rankingTop };
}
