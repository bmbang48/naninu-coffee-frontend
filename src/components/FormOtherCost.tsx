import { useStoreOtherCost,useUpdateOtherCost } from "../api/useOtherCost";
import { useEffect, useState } from "react";
import { formatCurrency, unformatCurrency } from "../components/FormatCurrency";

interface Props {
        isActiveForm: boolean;
        setIsActiveForm: (isActiveForm: boolean) => void;
        formData?: {
            id?: number | null;
            name_cost?: string;
            cost_per_product?: number;
        },
        mode: 'create' | 'edit';
    }
const FormOtherCost = ({isActiveForm, setIsActiveForm, formData, mode}: Props) =>{

    const {mutate: storeOtherCost, isPending: storeIsLoading, isSuccess: storeIsSuccess, isError: storeIsError} = useStoreOtherCost();
    const {mutate: updateOtherCost, isPending: updateIsLoading, isSuccess: updateIsSuccess, isError: updateIsError} = useUpdateOtherCost();

    
    const [localFormData, setLocalFormData] = useState({
        name_cost: '',
        cost_per_product: '',
    });

    useEffect(()=>{
        if (mode === 'edit' && formData) {
            setLocalFormData({
                name_cost: formData.name_cost || '',
                cost_per_product: formData.cost_per_product?.toString() || '',
            });
        } else {
            setLocalFormData({
                name_cost: '',
                cost_per_product: '',
            });
        }
    }
    , [formData, mode]);

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        const cleanCost = localFormData.cost_per_product.toString().replace(/\D/g, ''); 

        const data = new FormData();
        data.append('name_cost', localFormData.name_cost);
        data.append('cost_per_product', cleanCost);
        storeOtherCost(data);
        setLocalFormData({
            name_cost: '',
            cost_per_product: '',
        });
        if(isActiveForm){
            setIsActiveForm(!isActiveForm);
        }
    }

    const handleCloseForm = () => {
        setIsActiveForm(!isActiveForm);
    }

    const handleSubmitUpdate = (e: React.FormEvent) =>{
        e.preventDefault();
        if(!formData.id){
            console.error("No ID provided for update");
            return;
        }

        const cleanCost = localFormData.cost_per_product.toString().replace(/\D/g, '');
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name_cost', localFormData.name_cost);
        data.append('cost_per_product', cleanCost);
        updateOtherCost({id: formData.id, data});
        setLocalFormData({
            name_cost: '',
            cost_per_product: '',
        });
        if(isActiveForm){
            setIsActiveForm(!isActiveForm);
        }
    }



    return (
        <div className="form-other-cost d-flex flex-column justify-content-center align-items-center w-100">
            <div className="d-flex justify-content-end align-items-end w-100 pe-3 pt-2">
                <p className=" btn-x btn-x-other-cost d-block" onClick={handleCloseForm}>X</p>
            </div>
            <form encType="multipart/form-data" className="w-75" onSubmit={ mode === 'edit' ? handleSubmitUpdate : handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="other-cost-name" className="form-label">Other Cost Name</label>
                    <input type="text" className="form-control" id="other-cost-name" 
                    value={localFormData.name_cost}
                    onChange={(e) => setLocalFormData({...localFormData, name_cost: e.target.value})}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="text" className="form-control" id="price" 
                    value={formatCurrency(localFormData.cost_per_product)}
                    onChange={(e) => {
                        const unformattedValue = unformatCurrency(e.target.value);
                        setLocalFormData({...localFormData, cost_per_product: unformattedValue});
                    }}
                    />
                </div>
                <button className="btn btn-success w-100">Submit</button>
            </form>
        </div>
    )

}
export default FormOtherCost;