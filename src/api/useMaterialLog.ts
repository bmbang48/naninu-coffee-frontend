import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export const useMaterialLogs = (params:any) => {
  return useQuery({
    queryKey: ["material-logs", params],
    queryFn: async () => {
      const res = await api.get("/material-logs", { params });
      return res.data;
    }
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
    refetchInterval: 5000 // 🔥 tiap 5 detik update
  });
};