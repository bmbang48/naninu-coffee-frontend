import { baseUrl } from "./baseUrl";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCsrfCookie } from "./csrf";

interface TransactionItemPayload {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

interface StoreTransactionPayload {
  transaction_code: string;
  transaction_date: string;
  customer_name: string;
  discount: number;
  total_price: number;
  pay: number;
  change: number;
  tax: number;
  items: TransactionItemPayload[];
}


const storeTransaction = async (payload: StoreTransactionPayload) => {
  await getCsrfCookie();

  const response = await axios.post(`${baseUrl}/api/transactions`, payload, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
    },
  });

  // 🔥 INI KUNCINYA
  if (!response.data.success) {
    throw response.data; // ⬅️ penting
  }

  return response.data;
};

export const useStoreTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['transactions']});
        }
    });
};


const fetchTransaction = async () =>{
    const response = await fetch(`${baseUrl}/api/transactions`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept' : 'application/json',
        }
    });

    if(!response.ok) {
        throw new Error('Network response was not ok');
    }

    const json = await response.json();
    return json.data;
    
}

export const useTransactions = () =>{
    return useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransaction,
    })
}

const deleteTransaction = async (id:number) =>{
  const response = await fetch(`${baseUrl}/api/transactions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers:{
      'Accept': 'application/json',
    }
  });

  if(!response.ok){
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const useDeleteTransaction = () =>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['transactions']});
    }
  });
};