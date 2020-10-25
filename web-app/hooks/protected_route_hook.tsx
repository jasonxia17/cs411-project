import { useEffect } from "react";
import { useRouter } from "next/router";
import { Session, useSession } from "next-auth/client";

export default function useProtectedRoute(): [Session, boolean] {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) return;
    router.push("/api/auth/signin");
  }, [session]);

  return [session, loading];
}
