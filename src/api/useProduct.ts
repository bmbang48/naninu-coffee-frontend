import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "./baseUrl";
import { getCsrfCookie } from "./csrf";
// React fetch

const fetchAllProducts = async ()=>{
  const response = await fetch(`${baseUrl}/api/products-all`,{
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  if(!response.ok){
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data?? [];
}

export const useAllProducts = () => {  
  return useQuery({
    queryKey: ['all-products'],
    queryFn: fetchAllProducts,
  });
}



// fething products
const fetchProducts = async (page:number) => {
  const response = await fetch(`${baseUrl}/api/products?page=${page}`,{
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  // console.log(baseUrl);
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

const fetchProductsCashier = async(page:number, search: string="")=>{
  const params = new URLSearchParams({
    page: page.toString(),
    search: search
  });


  const response = await fetch(`${baseUrl}/api/products-cashier?${params.toString()}`, {
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  });

  if(!response.ok){
    throw new Error("Failed to fetch products cashier");
  }
  
  const json = await response.json();
  console.log(json);
  return json ?? [];
}


export const useProductsCashier = (page:number = 1, search:string = "")=>{
  return useQuery({
    queryKey: ['products', page, search],
    queryFn: ()=>fetchProductsCashier(page, search),
    placeholderData: (previousData) => previousData,
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