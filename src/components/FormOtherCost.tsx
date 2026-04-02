import { useStoreOtherCost,useUpdateOtherCost } from "../api/useOtherCost";
import { useEffect, useState } from "react";
import { formatCurrency, unformatCurrency } from "../components/FormatCurrency";

interface Props {
        isActiveForm: boolean;
        setIsActiveForm: (isActiveForm: boolean) => void;
        formData?: {
            id?: number | null;
            name_cost?: string;
            amount?: number;
        },
        mode: 'create' | 'edit';
    }
const FormOtherCost = ({isActiveForm, setIsActiveForm, formData, mode}: Props) =>{

    const {mutate: storeOtherCost, isPending: storeIsLoading, isSuccess: storeIsSuccess, isError: storeIsError} = useStoreOtherCost();
    const {mutate: updateOtherCost, isPending: updateIsLoading, isSuccess: updateIsSuccess, isError: updateIsError} = useUpdateOtherCost();

    
    const [localFormData, setLocalFormData] = useState({
        name_cost: '',
        amount: '',
    });

    useEffect(()=>{
        if (mode === 'edit' && formData) {
            setLocalFormData({
                name_cost: formData.name_cost || '',
                amount: formData.amount?.toString() || '',
            });
        } else {
            setLocalFormData({
                name_cost: '',
                amount: '',
            });
        }
    }
    , [formData, mode]);

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        const cleanCost = localFormData.amount.toString().replace(/\D/g, ''); 

        const data = new FormData();
        data.append('name_cost', localFormData.name_cost);
        data.append('amount', cleanCost);
        storeOtherCost(data);
        setLocalFormData({
            name_cost: '',
            amount: '',
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

        const cleanCost = localFormData.amount.toString().replace(/\D/g, '');
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name_cost', localFormData.name_cost);
        data.append('amount', cleanCost);
        updateOtherCost({id: formData.id, data});
        setLocalFormData({
            name_cost: '',
            amount: '',
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
                    value={formatCurrency(localFormData.amount)}
                    onChange={(e) => {
                        const unformattedValue = unformatCurrency(e.target.value);
                        setLocalFormData({...localFormData, amount: unformattedValue});
                    }}
                    />
                </div>
                <button className="btn btn-success w-100">Submit</button>
            </form>
        </div>
    )

}
export default FormOtherCost;