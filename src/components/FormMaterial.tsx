
import { useEffect, useState } from "react";
import { useStoreMaterial,useUpdateMaterial } from "../api/useMaterial";
import { formatCurrency, unformatCurrency, formatNumber } from "../components/FormatCurrency";

interface Props {
        isActiveForm: boolean;
        setIsActiveForm: (isActiveForm: boolean) => void;
        formData?: {
            id?: number | null;
            material_name?: string;
            price?: number | null;
            amount?: number | null;
            unit?: string;
        };
        mode: 'create' | 'edit';
    }
const FormMaterial = ({isActiveForm,setIsActiveForm,formData, mode} : Props) =>{
    
    

    const [localFormData, setLocalFormData] = useState({
        material_name: '',
        price: '',
        amount: '',
        unit: '',
    });

    useEffect(()=>{
        if (mode === 'edit' && formData) {
            setLocalFormData({
                material_name: formData.material_name || '',
                price: formData.price?.toString() || '',
                amount: formData.amount?.toString() || '',
                unit: formData.unit || '',
            });
        } else {
            setLocalFormData({
                material_name: '',
                price: '',
                amount: '',
                unit: '',
            });
        }
    }, [formData, mode]);
        

    const {mutate: storeMaterial } = useStoreMaterial();
    const {mutate: updateMaterial} = useUpdateMaterial();


    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        
        const cleanPrice = localFormData.price.toString().replace(/\D/g, '');
        const cleanAmount = localFormData.amount.toString().replace(/\D/g, '');
        const data = new FormData();
        data.append('name', localFormData.material_name);
        data.append('price', cleanPrice);
        data.append('amount', cleanAmount);
        data.append('unit', localFormData.unit);
        storeMaterial(data);
        setLocalFormData({
            material_name: '',
            price: '',
            amount: '',
            unit: '',
        });
        if(isActiveForm){
            setIsActiveForm(false);
        }
    }
    

    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.id){
            console.error('No ID provided for update');
            return;
        }

        const cleanPrice = localFormData.price.toString().replace(/\D/g, '');
        const cleanAmount = localFormData.amount.toString().replace(/\D/g, '');
        console.log("Cleaned Price:", cleanPrice);       
        console.log("Local Form Data:", localFormData);
        
        // console.log("Updating material with ID:", formData.id);
        const data = new FormData();
        data.append('_method', 'PUT'); // Use PUT method for update
        data.append('name', localFormData.material_name);
        data.append('price', cleanPrice);   
        data.append('amount', cleanAmount);
        data.append('unit', localFormData.unit);
        try {
            await updateMaterial({ id: formData.id, data });

            setLocalFormData({
            material_name: '',
            price: '',
            amount: '',
            unit: '',
            });

            if (isActiveForm) {
            setIsActiveForm(false);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    }


    const handleCloseForm = () => {
        setIsActiveForm(!isActiveForm);
    };


    // Format Currency Function
    

    return (
        <div className="form-material d-flex flex-column justify-content-center align-items-center fw-500 w-100">
            <div className="d-flex justify-content-end align-items-end w-100 pe-3 pt-2">
                <p className=" btn-x btn-x-material d-block" onClick={handleCloseForm}>X</p>
            </div>
            <form encType="multipart/form-data" className="w-75" onSubmit={ mode === 'edit' ? handleSubmitUpdate : handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="material-name" className="form-label">Material Name</label>
                    <input type="text" className="form-control" id="material-name" 
                        value={localFormData.material_name}
                        onChange={(e)=> setLocalFormData({...localFormData, material_name:e.target.value})}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="text" inputMode="numeric"
                        className="form-control" 
                        id="price" 
                        value={formatCurrency(localFormData.price)}
                        onChange={(e)=> {
                            const cleanValue = unformatCurrency(e.target.value);
                            setLocalFormData({...localFormData, price: cleanValue});
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input type="text" inputMode="numeric" className="form-control" id="amount" 
                        value={formatNumber(localFormData.amount)}
                        onChange={(e)=> {
                            const cleanValue = unformatCurrency(e.target.value);
                            setLocalFormData({...localFormData, amount: cleanValue})
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="unit" className="form-label">Unit</label>
                    <input type="text" className="form-control" id="unit" 
                    value={localFormData.unit}
                    onChange={(e)=>setLocalFormData({...localFormData, unit:e.target.value})}
                    />
                </div>
                <button className="btn btn-success w-100">Submit</button>
            </form>
        </div>
    )
}

export default FormMaterial;