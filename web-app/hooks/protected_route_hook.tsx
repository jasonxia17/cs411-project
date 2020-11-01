import { useEffect } from "react";
import { useRouter } from "next/router";
import { Session, useSession } from "next-auth/client";

export default function useProtectedRoute(): [Session, boolean] {
  const [session, loading] = useSession();
  const router = useRouter();

  const SIGNIN_PATH = "/api/auth/signin";
  const SET_USER_NAME_PATH = "/set_user_name";

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.push(SIGNIN_PATH);
      return;
    }

    if (session.user.name === null && router.pathname != SET_USER_NAME_PATH) {
      router.push(SET_USER_NAME_PATH);
    }
  }, [session]);

  return [session, loading];
}
