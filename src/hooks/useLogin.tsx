import * as React from "react";
import { useLocalState } from "./useLocalState";
import { loginAndFetchRanking } from "../services/loginService";
import type { Guid } from "../types/chatDto";

export function useLogin() {
  const [user, setUser] = useLocalState<{ id: string | null; username: string | null }>(
    "stroob_user",
    { id: null, username: null }
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const doLogin = React.useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const { res /*, rankingTop*/ } = await loginAndFetchRanking(username);
      // Guarda id, username 
      setUser({ id: res?.user?.id as Guid, username: res?.user?.username ?? null });
      return res;
    } catch (e: any) {
      setError(e?.message ?? "Error de login");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return { user, loading, error, doLogin, setUser };
}
