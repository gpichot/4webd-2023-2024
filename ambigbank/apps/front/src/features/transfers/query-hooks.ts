import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";
import { useAuthedContext } from "../users";
import { Transfer } from "./types";

export function useListTransfersQuery() {
  const auth = useAuthedContext();
  return useQuery({
    queryKey: ["transfers"],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/transfers`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.json() as Promise<Transfer[]>;
    },
  });
}
