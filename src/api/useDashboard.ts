import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export const useCashflow = (params:any) => {
  return useQuery({
    queryKey: ["cashflow", params],
    queryFn: async () => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== "")
        );

        const res = await api.get("/cashflow", {
            params: cleanParams
        });

        return res.data;
        }
  });
};