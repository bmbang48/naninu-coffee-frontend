import { useQuery, useMutation } from "@tanstack/react-query";
import api from "./axios";

export const useCashflows = (params:any) => {
  return useQuery({
    queryKey: ["cashflows", params],
    queryFn: async () => {
      const res = await api.get("/cashflows", { params });
      return res.data;
    }
  });
};

export const useCreateCashflow = () => {
  return useMutation({
    mutationFn: async (data:any) => {
      const res = await api.post("/cashflows", data);
      return res.data;
    }
  });
};

export const useCashflowSummary = () => {
  return useQuery({
    queryKey: ["cashflow-summary"],
    queryFn: async () => {
      const res = await api.get("/cashflows-summary");
      return res.data;
    }
  });
};

export const useCashflowChart = (params:any) => {
  return useQuery({
    queryKey: ["cashflow-chart", params],
    queryFn: async () => {
      const res = await api.get("/cashflows-chart", { params });
      return res.data;
    }
  });
};