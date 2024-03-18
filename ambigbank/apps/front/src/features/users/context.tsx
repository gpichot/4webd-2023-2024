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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useSynchronizedLocalStorage("amBigbankToken", null);

  const value = useMemo(() => {
    const signIn = async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
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
      } else {
        throw new Error("Invalid credentials");
      }
    };
    const signOut = () => setToken(null);
    return { token, signIn, signOut };
  }, [token, setToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
