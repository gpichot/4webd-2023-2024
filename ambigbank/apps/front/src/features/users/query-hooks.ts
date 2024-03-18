import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";
import { User } from "./types";

export function useGetUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/users`);
      return response.json() as Promise<User[]>;
    },
  });
}
