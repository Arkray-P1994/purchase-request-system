import { useUser } from "@/api/fetch-user";
import { useRouter } from "@tanstack/react-router";
import Spinner from "@/components/ui/spinner";
import React, { createContext, useContext, useEffect, useMemo } from "react";

/** ---------- Types ---------- */
export interface User {
  id: string;
  username: string;
  name: string;
  position: string;
  department: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/** * Matches the JSON structure provided:
 * { "authenticated": true, "user": { "id": 1, "position": "admin", "team_name": "QC", ... } }
 */
interface RawUserResponse {
  authenticated: boolean;
  user: {
    id: string | number;
    username: string;
    name: string;
    position: string;
    team_name: string; // Corrected from 'department' to match your JSON
    created_at?: string;
  } | null;
  message?: string;
}

type RawUser = RawUserResponse | null | undefined;

/** ---------- Utils ---------- */
function toUser(candidate?: RawUserResponse["user"]): User | null {
  if (!candidate) return null;

  return {
    id: String(candidate.id ?? "unknown"),
    username: candidate.username ?? "",
    name: candidate.name ?? "",
    position: candidate.position ?? "",
    // Mapping 'team_name' from JSON to 'department' in our App State
    department: candidate.team_name ?? "",
  };
}

function normalizeUser(raw: RawUser): {
  user: User | null;
  isAuthenticated: boolean;
  err: string | null;
} {
  if (!raw) return { user: null, isAuthenticated: false, err: null };

  if (raw.authenticated === true && raw.user) {
    return {
      user: toUser(raw.user),
      isAuthenticated: true,
      err: null,
    };
  }

  if (raw.authenticated === false) {
    return {
      user: null,
      isAuthenticated: false,
      err: raw.message ?? "Not authenticated",
    };
  }

  return { user: null, isAuthenticated: false, err: null };
}

function effectiveErrorString(
  normalizedErr: string | null,
  hookErr: unknown,
): string | null {
  if (normalizedErr) return normalizedErr;
  if (!hookErr) return null;
  if (typeof hookErr === "string") return hookErr;
  if (typeof hookErr === "object" && hookErr && "message" in hookErr) {
    const m = (hookErr as any).message;
    return typeof m === "string" ? m : JSON.stringify(hookErr);
  }
  return String(hookErr);
}

/** ---------- Context ---------- */
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user: rawUser,
    isLoading,
    error,
  } = useUser() as {
    user: RawUser;
    isLoading: boolean;
    error?: unknown;
  };

  const value = useMemo<AuthState>(() => {
    const { user, isAuthenticated, err } = normalizeUser(rawUser);
    const errStr = effectiveErrorString(err, error);

    return {
      isAuthenticated: isAuthenticated || !!user,
      user,
      isLoading: !!isLoading,
      error: errStr,
    };
  }, [rawUser, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/** ---------- RequireAuth ---------- */
interface RequireAuthProps {
  children: React.ReactNode;
  /** If true, only users with position === 'admin' can enter */
  superAdminOnly?: boolean;
}

export function RequireAuth({
  children,
  superAdminOnly = false,
}: RequireAuthProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only attempt navigation after loading is finished
    if (!isLoading) {
      if (!isAuthenticated) {
        router.navigate({ to: "/login" });
      } else if (superAdminOnly && user?.position !== "superadmin") {
        // User is logged in but is NOT an admin
        // Redirect them to a dashboard or a "403 Forbidden" page
        router.navigate({ to: "/" });
      }
    }
  }, [isLoading, isAuthenticated, user, superAdminOnly, router]);

  if (isLoading) {
    return <Spinner />;
  }

  // Guard against rendering children if authentication or role check fails
  if (!isAuthenticated) return null;
  if (superAdminOnly && user?.position !== "superadmin") return null;

  return <>{children}</>;
}
