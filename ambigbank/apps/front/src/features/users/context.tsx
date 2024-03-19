import { config } from "@/config";
import { z } from "zod";
import { createContext, useMemo } from "react";
import useSynchronizedLocalStorage from "./hooks/useSynchronizedLocalStorage";

const SignInResponseSchema = z.object({
  accessToken: z.string(),
});

export interface AuthContextType {
  token: string | null;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * Parse jwt token and re sign in the user when the token is expired
 */
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useSynchronizedLocalStorage("amBigbankToken", null);

  const value = useMemo(() => {
    async function signIn({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      const response = await fetch(`${config.apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const json = await response.json();

        const { accessToken } = SignInResponseSchema.parse(json);
        setToken(accessToken);
        const parsedToken = parseJwt(accessToken);

        const timeout = parsedToken.exp * 1000 - Date.now();
        console.log("timeout", timeout);
        setTimeout(() => {
          signIn({ email, password });
        }, timeout);
      } else {
        throw new Error("Invalid credentials");
      }
    }
    const signOut = () => setToken(null);
    return { token, signIn, signOut };
  }, [token, setToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
