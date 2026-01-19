import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { baseUrl } from './baseUrl';
import { getCsrfCookie } from './csrf';



const fetchOtherCosts = async () => {
    const response = await fetch(`${baseUrl}/api/other-cost`, {
        credentials: 'include',
        headers: {
        'Accept': 'application/json',
        }
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const json = await response.json();
    
    return json.data.data;
}

export const useOtherCosts = () => {
    return useQuery({
        queryKey: ['other-costs'],
        queryFn: fetchOtherCosts,
    });
};

const storeOtherCost = async (data: FormData) =>{
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/other-cost`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
        body: data,
    });

    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const useStoreOtherCost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeOtherCost,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ['other-costs'] });
        }
    });
};

const deleteOtherCost = async (id: number) =>{
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/other-cost/${id}`,{
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        }
    });
    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const useDeleteOtherCost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOtherCost,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ['other-costs'] });
        }
    });
};

const updateOtherCost = async({id, data}: {id:number, data: FormData}) => {
    await getCsrfCookie();
    const response = await fetch(`${baseUrl}/api/other-cost/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
        body: data,
    });
    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const useUpdateOtherCost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOtherCost,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ['other-costs'] });
        }
    });
}