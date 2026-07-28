"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "./hooks";
import { setSession, setSessionLoading } from "./authSlice";

/**
 * Bridges next-auth's client session (source of truth) into the Redux store
 * so the rest of the app can read auth state via useAppSelector/useAuth.
 */
export function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setSessionLoading());
      return;
    }

    if (status === "authenticated" && session?.user) {
      dispatch(
        setSession({
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.name ?? null,
          phone: session.user.phone,
          role: session.user.role,
        })
      );
    } else {
      dispatch(setSession(null));
    }
  }, [session, status, dispatch]);

  return null;
}
