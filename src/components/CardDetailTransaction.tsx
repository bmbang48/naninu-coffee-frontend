import { useEffect, useState } from "react";
import { formatCurrency, formatLocalDate } from "./FormatCurrency";
import { getDayName } from "../api/getDate";
import { useDeleteTransaction } from "../api/useTransaction";
import ConfirmationAlert from "../components/ConfirmationAlert";
const CardDetailTransaction = ({selectedDay,onClose})=>{
    const [isExpanded, setIsExpanded] = useState(true);
    
    const [isActiveConfirmDelete, setIstActiveConfirmDelete] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [id,setId] = useState(0);
    const {mutate:deleteTransaction} = useDeleteTransaction();
    
    useEffect(()=>{
        
        if(!isConfirmDelete) return
        console.log('Delete');
        deleteTransaction(id);
        setIsConfirmDelete(false);
        
    },[isConfirmDelete,id,deleteTransaction,selectedDay])
    if(!selectedDay) return null;
    
    const {date,transaction} = selectedDay;

    const dailyRevenue = transaction.reduce(
        (sum,t) => sum + t.items.reduce((s,item)=>s+item.subtotal, 0),
        0
    );

    const handleActiveDelete = (id:number) => {
      setId(id);
      setIstActiveConfirmDelete(!isActiveConfirmDelete); 
    }
    
    

    return (
        <div className="popup-overlay">
            <div className="popup-card">
                <div className="popup-header" onClick={()=>setIsExpanded(!isExpanded)} >
                    <div>
                        <h3 className="day-date">
                            {getDayName(date)}, {formatLocalDate(date)}
                        </h3>
                        <p className="day-stats">
                        {transaction.length} • {formatCurrency(dailyRevenue)} revenue
                        </p>
                    </div>
                    <span className="expand-icon fw-bold cursor-pointer" style={{ cursor: "pointer" }} onClick={onClose}>
                            X
                    </span>
                </div>
                {
          isActiveConfirmDelete ? <ConfirmationAlert 
          isConfirm={isActiveConfirmDelete} 
          setIsConfirm={setIstActiveConfirmDelete} 
          isConfirmDelete={isConfirmDelete} 
          setIsConfirmDelete={setIsConfirmDelete} /> : null
        }

                {isExpanded && (
                    <div className="day-details">
                    <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Product List</th>
                                    <th className="text-center">Total Items</th>
                                    <th className="text-end">Total Price</th>
                                    <th className="text-center">Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.map((t)=>{
                                    const totalItems = t.items.reduce((sum,i)=> sum + i.quantity,0);
                                    const totalPrice = t.items.reduce((sum,i)=> sum + i.subtotal,0);

                                    return(
                                        <tr key={t.id}>
                                            <td className="order-number">{t.transaction_code}</td>
                                            <td>
                                                <div className="product-summary">
                                                    {t.items.map((item)=>(
                                                        <span className="product-tag" key={item.id}>
                                                            {item.product.product_name} x {item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-center">{totalItems}</td>
                                            <td className="text-end total-price">
                                            {formatCurrency(totalPrice)}
                                            </td>
                                            <td className="text-center">
                                            <button className="btn btn-sm btn-outline-danger ms-3" onClick={()=>handleActiveDelete(t.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                
                            </tbody>
                    </table>
                </div>
            )}
        </div>
        </div>
    );
}

export default CardDetailTransaction;