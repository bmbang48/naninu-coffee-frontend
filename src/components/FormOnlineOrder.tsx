import { useState } from "react";
import { formatCurrency,unformatCurrency } from "./FormatCurrency";

interface Props{
    isActiveForm: boolean,
    setIsActiveForm: (isActiveForm:boolean)=> void,
    total_price: number,
    order_method:string,
    onSave: (newPrice : number,  newMethod:string)=>void,
}
const FormOnlineOrder = ({isActiveForm,setIsActiveForm,total_price ,order_method,onSave}:Props)=>{
    const handleCloseForm = () => {
        setIsActiveForm(!isActiveForm);
    }

    const [totalPrice,setTotalPrice] = useState(total_price);
    const [orderMethod,setOrderMethod] = useState(order_method);

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        onSave(totalPrice,orderMethod);
        setOrderMethod(orderMethod);
        setIsActiveForm(!isActiveForm);
    }
    return (
        <div className="form-other-cost d-flex flex-column justify-content-center align-items-center ">
                    <div className="d-flex justify-content-end align-items-end w-100 pe-3 pt-2">
                        <p className=" btn-x btn-x-other-cost d-block" onClick={handleCloseForm}>X</p>
                    </div>
                    <form encType="multipart/form-data" className="w-75" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="other-cost-name" className="form-label summary-label fw-bold" style={{color:"#2d5a3d"}}>{orderMethod}</label>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">Total Price</label>
                            <input type="text" className="form-control" id="price" 
                            value={formatCurrency(totalPrice)}
                            onChange={(e) => {
                                const unformattedValue = unformatCurrency(e.target.value);
                                setTotalPrice(Number(unformattedValue));
                            }}
                            />
                        </div>
                        <button className="btn btn-success w-100">Simpan</button>
                    </form>
                </div>
    )
}

export default FormOnlineOrder;