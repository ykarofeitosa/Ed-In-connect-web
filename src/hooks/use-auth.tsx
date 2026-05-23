import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { api } from "../lib/api";
import {
  saveSession,
  clearSession,
  getUser,
  type AuthUser,
  type AuthSession,
} from "../lib/auth";

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getUser());

  const signIn = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    console.log("chegou aqui")
    const session = await api.post<AuthSession>("/auth", { email, password });
    console.log("chegou session: ", session)
    saveSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}