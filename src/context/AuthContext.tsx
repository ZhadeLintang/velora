import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AuthProvider centralizes Supabase Auth state and exposes a production-ready flow to pages.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Supabase Auth session hydration runs once and then listens for login/register/logout changes.
    const hydrateSession = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    };

    void hydrateSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      login: async (email, password) => {
        if (!isSupabaseConfigured) {
          setSession({
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "demo-user",
              app_metadata: {},
              user_metadata: { full_name: "Lumora Demo" },
              aud: "authenticated",
              created_at: new Date().toISOString(),
              email,
            },
          } as Session);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw new Error(error.message);
        }
      },
      register: async (email, password) => {
        if (!isSupabaseConfigured) {
          setSession({
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "demo-user",
              app_metadata: {},
              user_metadata: { full_name: "Lumora Demo" },
              aud: "authenticated",
              created_at: new Date().toISOString(),
              email,
            },
          } as Session);
          return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          throw new Error(error.message);
        }
      },
      logout: async () => {
        if (!isSupabaseConfigured) {
          setSession(null);
          return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth gives components a small, typed API for auth state management.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
