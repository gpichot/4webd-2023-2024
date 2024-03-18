import { useContext } from "react";
import { AuthContext } from "../context";

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export function useAuthedContext() {
  const context = useAuthContext();

  if (!context.token) {
    throw new Error("User should be authenticated");
  }

  return context;
}
