import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AuthProvider centralizes Supabase Auth state and exposes a production-ready flow to pages.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Supabase Auth session hydration runs once and then listens for login/register/logout changes.
    const hydrateSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
          setLoading(false);
        }
      } catch (err) {
        console.error("Supabase hydration error:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void hydrateSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
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
          if (error.message.toLowerCase().includes("email not confirmed")) {
            throw new Error(
              "Email address not confirmed. Please check your inbox, or go to your Supabase Dashboard -> Auth -> Providers -> Email and toggle 'Confirm email' OFF for development."
            );
          }
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            throw new Error("Invalid email or password. Please make sure you have created an account first!");
          }
          throw new Error(error.message);
        }
      },
      register: async (email, password, fullName, username) => {
        const formattedUsername = username.startsWith("@") ? username : `@${username}`;

        if (!isSupabaseConfigured) {
          setSession({
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: "demo-user",
              app_metadata: {},
              user_metadata: { full_name: fullName, username: formattedUsername },
              aud: "authenticated",
              created_at: new Date().toISOString(),
              email,
            },
          } as Session);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: formattedUsername,
            },
          },
        });

        if (error) {
          if (error.status === 500 || error.message.toLowerCase().includes("database error")) {
            throw new Error(
              "Database signup error (500). This occurs when a database trigger on new users fails. Please verify that your 'profiles' table and 'on_auth_user_created' trigger are correctly created in your Supabase SQL editor."
            );
          }
          if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
            throw new Error("Email signup rate limit exceeded. Please wait a few minutes before trying again.");
          }
          throw new Error(error.message);
        }

        // Proactive client-side profiles creation fallback in case triggers are not yet setup
        if (data?.user) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              name: fullName,
              handle: formattedUsername,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            });
          } catch (profileErr) {
            console.warn("Client fallback profile creation warning:", profileErr);
          }
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
