import { useQuery } from "@tanstack/react-query";
import { BankAccount } from "./types";
import { config } from "@/config";
import { useAuthedContext } from "../users";

export function useListAccountsQuery() {
  const auth = useAuthedContext();

  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/bank-accounts`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.json() as Promise<BankAccount[]>;
    },
  });
}
