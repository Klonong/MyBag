import { signOut } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";

const useAuth = () => {
  const { user, status } = useAppSelector((state) => state.auth);

  async function logout() {
    await signOut({ redirect: false });
  }

  return { user, profile: user, loading: status === "loading", logout };
};

export default useAuth;
