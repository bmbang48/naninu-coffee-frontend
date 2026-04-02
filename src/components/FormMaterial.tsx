
import { useEffect, useState,useRef } from "react";
import { useStoreMaterial,useUpdateMaterial } from "../api/useMaterial";
import { formatCurrency, unformatCurrency, formatNumber } from "../components/FormatCurrency";

interface Props {
        isActiveForm: boolean;
        setIsActiveForm: (isActiveForm: boolean) => void;
        formData?: {
            id?: number | null;
            name?: string;
            price?: number | null;
            amount?: number | null;
            stock?: number | null;
            min_stock?: number | null;
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
        stock: '',
        min_stock: '',
    });

    useEffect(() => {
        if (mode === 'edit' && formData) {
            setLocalFormData({
                material_name: formData.name || '',
                price: formData.price?.toString() || '',
                amount: formData.amount?.toString() || '',
                unit: formData.unit || '',
                stock: formData.stock?.toString() || '',
                min_stock: formData.min_stock?.toString() || '',
            });
        } else {
            setLocalFormData({
                material_name: '',
                price: '',
                amount: '',
                unit: '',
                stock: '',
                min_stock: '',
            });
        }
    }, [formData, mode]);
        

    const { unit, min_stock } = localFormData;

    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        if (!min_stock && unit) {

            let defaultMin = 0;

            if (unit === 'pcs') defaultMin = 25;
            if (unit === 'ml') defaultMin = 1000;
            if (unit === 'gram') defaultMin = 100;

            setLocalFormData(prev => ({
                ...prev,
                min_stock: defaultMin.toString()
            }));

            isInitialized.current = true;
        }
    }, [unit, min_stock]); 

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
        data.append('stock', localFormData.stock);
        data.append('min_stock', localFormData.min_stock);
        storeMaterial(data);
        setLocalFormData({
            material_name: '',
            price: '',
            amount: '',
            unit: '',
            stock: '',
            min_stock: '',
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
        data.append('stock', localFormData.stock);
        data.append('min_stock', localFormData.min_stock);
        try {
            await updateMaterial({ id: formData.id, data });

            setLocalFormData({
            material_name: '',
            price: '',
            amount: '',
            unit: '',
            stock: '',
            min_stock: '',
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
    console.log(formData);


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
                <div className="mb-3">
                    <label>Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={localFormData.stock}
                        onChange={(e) =>
                            setLocalFormData({ ...localFormData, stock: e.target.value })
                        }
                    />
                </div>

                <div className="mb-3">
                    <label>Minimum Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={localFormData.min_stock}
                        onChange={(e) =>
                            setLocalFormData({ ...localFormData, min_stock: e.target.value })
                        }
                    />
                </div>
                <button className="btn btn-success w-100">Submit</button>
            </form>
        </div>
    )
}

export default FormMaterial;