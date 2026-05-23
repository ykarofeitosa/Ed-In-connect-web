export type UserRole = "STUDENT" | "TEACHER" | "GUARDIAN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = "@edinconnect:token";
const USER_KEY = "@edinconnect:user";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);

  if (!token || !raw) return null;

  try {
    return {
      token,
      user: JSON.parse(raw) as AuthUser,
    };
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser(): AuthUser | null {
  return getSession()?.user ?? null;
}

// Mapeia o role do backend para o role do front
export function roleToFrontend(role: UserRole): "student" | "teacher" | "family" {
  const map: Record<UserRole, "student" | "teacher" | "family"> = {
    STUDENT: "student",
    TEACHER: "teacher",
    GUARDIAN: "family",
  };
  return map[role];
}

// Mapeia o role do front para a rota do dashboard
export function roleToDashboard(role: UserRole): "/student" | "/teacher" | "/family" {
  const map: Record<UserRole, "/student" | "/teacher" | "/family"> = {
    STUDENT: "/student",
    TEACHER: "/teacher",
    GUARDIAN: "/family",
  };
  return map[role];
}