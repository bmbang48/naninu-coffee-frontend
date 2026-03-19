import { baseUrl } from "./baseUrl";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCsrfCookie } from "./csrf";
// import { Recipe } from "../types/recipe";
import { StoreRecipePayload, UpdateRecipePayload } from "../types/recipe";


const fetchRecipes = async ()=>{
    const response = await fetch(`${baseUrl}/api/recipe-product`, {
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
    return JSON.parse(JSON.stringify(json.data));

}

export const useRecipes = () =>{
    return useQuery({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    })
}


const storeRecipe = async (payload: StoreRecipePayload)=>{
    // console.log(payload);
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/recipe-product`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
        },
        body : JSON.stringify(payload),
    });
    
    if(!response.ok){
        throw new Error('Network response is not OK');
    }

    return response.json();
}

export const useStoreRecipe = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeRecipe,
        onSuccess: ()=>{
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    });
};

const deleteRecipe = async (id: number) => {
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/recipe-product/${id}`, {
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

export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        }
    });
}


const showRecipe = async (id: number) => {
    const response = await fetch(`${baseUrl}/api/recipe-product/${id}`, {
        method: 'GET',
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

export const useShowRecipe = (id: number) => {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: () => showRecipe(id),
        enabled: !!id, // Only run if id is truthy
    });
};


const updateRecipeRequest = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateRecipePayload;
}) => {
  await getCsrfCookie();

  const response = await fetch(`${baseUrl}/api/recipe-product/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};


export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecipeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

