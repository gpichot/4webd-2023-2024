import React from "react";

export interface ApiContextType {
  fetch: typeof fetch;
}

export const ApiContext = React.createContext<ApiContextType | undefined>(
  undefined,
);

export function ApiProvider(
{ children}:{children: React.ReactNode}
 }) {
  

}
