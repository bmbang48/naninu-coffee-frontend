import { useEffect, useState } from "react";
import { formatCurrency, formatLocalDate } from "./FormatCurrency";
import { getDayName } from "../api/getDate";
import { useDeleteTransaction } from "../api/useTransaction";
import ConfirmationAlert from "../components/ConfirmationAlert";
interface MethodStats {
    totalRevenue:number;
    totalQty:number;
}

interface StatsAccumulator{
    [key:string]: MethodStats;
}
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
        (sum,t) => sum + (t.total_price || 0 ), 0);

    const handleActiveDelete = (id:number) => {
      setId(id);
      setIstActiveConfirmDelete(!isActiveConfirmDelete); 
    }

    const revenueByMethod = transaction.reduce((acc: StatsAccumulator, t)=> {
        const amount = t.total_price || 0;
        const method = t.payment_method;
        const totalQtyInTransaction = t.items.reduce((sum,item)=>sum + item.quantity,0);

        if(!acc[method]){
            acc[method] = {totalRevenue : 0, totalQty: 0};
        }
        acc[method].totalRevenue += amount;
        acc[method].totalQty += totalQtyInTransaction;
        return acc;
    },{} as StatsAccumulator);
    
    

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
                <div className="popup-header payment-header">
                    {(Object.entries(revenueByMethod) as [string,MethodStats][]).map(([method, stats])=>(
                        <div key={method}>
                            <p className="day-date">
                                {method}
                            </p>
                            <p className="day-stats">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                            <p className="day-stats">
                                {stats.totalQty} Items
                            </p>
                        </div>
                    ))}
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
                    <table className="custom-table card-detail">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th className="text-center text-md-start  products-sold">Product List</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-center">Payment</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.map((t)=>{
                                    const totalItems = t.items.reduce((sum,i)=> sum + i.quantity,0);

                                    return(
                                        <tr key={t.id}>
                                            <td className="order-number">{t.transaction_code.split("-")[0]}</td>
                                            <td className="products-sold">
                                                <div className="product-summary float-end float-md-none">
                                                    {t.items.map((item)=>(
                                                        <span className="product-tag" key={item.id}>
                                                            {item.product.product_name} x {item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-center">{totalItems}</td>
                                            <td className="text-center"><span className={`btn btn-sm  
                                                                        ${t.payment_method === "ShopeeFood" ? "btn-warning btn-shopeefood" : 
                                                                            t.payment_method === "GrabFood" ? "btn-primary btn-grabfood" :
                                                                            t.payment_method === "GoFood" ? "btn-danger btn-gofood" :
                                                                            t.payment_method === "Cash" ? "btn-secondary" :
                                                                            t.payment_method === "QRIS" ? "btn-dark" : ""
                                                                        }
                                                                        `}>{t.payment_method}</span></td>
                                            <td className="text-end total-price">
                                            {formatCurrency(t.total_price)}
                                            </td>
                                            <td className="text-center">
                                            <button className="btn btn-sm btn-outline-danger ms-3 btn-trash" onClick={()=>handleActiveDelete(t.id)}>
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