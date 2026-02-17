import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "./baseUrl";
import { getCsrfCookie } from "./csrf";
// React fetch


// fething products
const fetchProducts = async (page:number) => {
  const response = await fetch(`${baseUrl}/api/products?page=${page}`,{
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  console.log(baseUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useProducts = (page?:number) => {  
  const currentPage = page ?? 1;
  return useQuery({
    queryKey: ['products',currentPage],
    queryFn: ()=>fetchProducts(currentPage),
  });
}

const fetchProductsCashier = async(page:number)=>{
  const response = await fetch(`${baseUrl}/api/products-cashier?page=${page}`, {
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  });

  if(!response.ok){
    throw new Error("Failed to fetch products cashier");
  }
  const json = await response.json();
  return json.data ?? [];
}


export const useProductsCashier = (page?:number)=>{
  const currentPage = page ?? 1;
  return useQuery({
    queryKey: ['products', currentPage],
    queryFn: ()=>fetchProductsCashier(currentPage)
  });
}


//Store Data
const storeProduct = async (data: FormData) => {
  await getCsrfCookie();
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept' : 'application/json',
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useStoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation ({
    mutationFn: storeProduct,
    onSuccess: () =>{
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

const deleteProduct = async (id:number) =>{
  await getCsrfCookie();
  const response = await fetch(`${baseUrl}/api/products/${id}`, {
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

export const useDeleteProduct = () =>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

const updateProduct = async({id,data}:{id:number,data:FormData})=>{
  await getCsrfCookie();
  const response = await fetch(`${baseUrl}/api/products/${id}`,{
    method: 'POST',
    credentials: 'include',
    headers:{
      'Accept': 'application/json',
    },
    body:data,
  });
  if(!response.ok){
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useUpdateProduct = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}