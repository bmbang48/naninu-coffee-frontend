import { baseUrl } from "./baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCsrfCookie } from "./csrf";


const fetchMaterials = async (page:number) => {
    const response = await fetch(`${baseUrl}/api/materials?page=${page}`,{
        credentials: 'include',
        headers: {
            accept: 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.data ?? [];
};

export const useMaterials = (page?: number) =>{
    const currentPage = page ?? 1;
    return useQuery({
        queryKey: ['materials', currentPage],
        queryFn: ()=>fetchMaterials(currentPage),
    });
}




// fetch semua material tanpa pagination
const fetchAllMaterials = async () => {
  const response = await fetch(`${baseUrl}/api/materials-all`, {
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch materials');
  }

  const data = await response.json();
  return data?? [];
};

export const useAllMaterials = () => {
  return useQuery({
    queryKey: ['materials-all'],
    queryFn: fetchAllMaterials,
  });
};



const storeMaterial = async (data: FormData) =>{
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/materials`, {
        method: 'POST',
        credentials: 'include',
        headers:{
            'Accept': 'application/json',
        },
        body: data,
    });

    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const useStoreMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeMaterial,
        onSuccess: () =>{
            queryClient.invalidateQueries({

                queryKey: ['materials']
            })
        }
    });
};

const deleteMaterial = async (id: number) => {
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/materials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}   

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries(
                {
                    queryKey:['materials']
                }
            );
        }
    });
};


const updateMaterial = async ({id, data}: {id: number, data: FormData}) => {
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/materials/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const useUpdateMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries(
                {
                    queryKey:['materials']
                }
            );
        }
    });
};

