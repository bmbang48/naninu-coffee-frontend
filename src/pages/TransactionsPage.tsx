import { useTransactions } from "../api/useTransaction";
import { useState } from "react";
import { formatCurrency,formatLocalDate } from "../components/FormatCurrency";
import {getDayName} from "../api/getDate";
import CardDetailTransaction from "../components/CardDetailTransaction";
import { Product } from "../types/product";

interface Transaction{
    id: number;
    customer_name: string ;
    pay: number;
    total_price: number;
    order_method:string;
    payment_method:string;
    transaction_code: string;
    transaction_date: string;
    items: Item[];
}

interface Item{
    id: number;
    price: number;
    product_id: number;
    quantity: number;
    subtotal: number;
    transaction_id: number;
    product: Product[];
}

interface SelectedDay {
    date: string;
    transaction: Transaction[];
}


const TransactionsPage = ()=>{

    const {data: transactions, isLoading: transactionsIsLoading, error: transactionsError} = useTransactions();
    
        
        const today = new Date().toISOString().slice(0, 7);
        const [selectedMonth, setSelectedMonth] = useState(today);
        

    const filteredDataMonth = (transactions ?? []).filter((m) => {
    return selectedMonth
        ? m.transaction_date.slice(0, 7) === selectedMonth
        : null;
        });

     const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    
    
    const groupedTransacitons:Record<string, Transaction[]> = filteredDataMonth.reduce((acc,item)=>{
        const date = item.transaction_date;
        if(!acc[date]){
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    },  {});

    const getDailyProductSummary = (transactionsPerDay)=>{
        const summary = {};

        transactionsPerDay.forEach(t => {
        t.items.forEach(item => {
            const name = item.product?.product_name;  // ambil nama produk
            const qty = Number(item.quantity);        // ambil quantity

            if (!name) return; // skip jika tidak ada nama produk

            if (!summary[name]) {
                summary[name] = 0;
            }

            summary[name] += qty;
        });
    });
        return summary;
    }

    //Jumlah
    const sumTransaction = (t) =>
    t.items.reduce((itemSum, item) => itemSum + item.subtotal, 0);

    const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

    


    return(
        <div className="overflow-x-hidden">
            <div className="page-header">
                            <h1 className="page-title">Transactions Page</h1>
                <div className="container-fluid px-4 row">
                        <div className="col-md-9">
                                <p className="page-subtitle">
                                    Monitor Naninu Coffee sales, revenue and daily performance at a glance.
                                </p>
                        </div>
                        <div className="col-md-3">
                            <label className="filter-label">Select Month</label>
                            <select className="form-select form-select-custom"
                                value={selectedMonth}
                                onChange={(e)=>setSelectedMonth(e.target.value)}
                                >
                                {months.map((month,index)=>{
                                    const monthNumber = String(index + 1).padStart(2,"0");
                                    return(
                                        <option value={`${currentYear}-${monthNumber}`}>
                                            {`${month} ${currentYear}`}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                </div>
            </div>
                {/* Table */}
                 <div className="table-card">
                        <div className="table-header">
                            <div>
                                <h2 className="table-title">Monthly Report</h2>
                                <p className="table-description">
                                    Daily breakdown for the selected month (1 row = 1 day)
                                </p>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">No</th>
                                        <th className="text-center text-md-start">Date</th>
                                        <th className="text-center" >Total Orders</th>
                                        <th className="text-center" >Total Items</th>
                                        <th className="head-products-summary">Products Summary</th>
                                        <th className="text-center">Payment Method</th>
                                        <th className="text-end">Total Price</th>
                                        <th className="text-center">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        transactionsError ? (<p>Oops Data Transaction Error</p>) : 
                                        transactionsIsLoading ? (<p>Loading...</p>) : 
                                        filteredDataMonth.length<1 ? (
                                            <p>Tidak ada transaksi di bulan ini</p>
                                        ) : 
                                        Object.entries(groupedTransacitons).map(([date,transaction],index)=>{
                                            const productSummary = getDailyProductSummary(transaction)
// console.log("Data Product Summary: ", productSummary)
                                            const paymentSummary = transaction.reduce((acc,t)=>{
                                                const method = t.order_method || "Offline";
                                                acc[method] = (acc[method] || 0) + 1;
                                                return acc;
                                            },{})
                                        // console.log(transaction);

                                       return (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="ps-2 ps-md-3">
                                                <div className="date-cell">{formatLocalDate(date)}</div>
                                                <span className="day-name">{getDayName(date)}</span>
                                            </td>
                                            <td className="text-center">{transaction.length} Order</td>
                                            <td className="text-center">{
                                                transaction.reduce((sum,t)=> sum + t.items.length,0)
                                                } Items</td>
                                            <td className="td-products-summary">
                                                <div className="product-summary">
                                                    {
                                                        Object.entries(productSummary).map(([name,qty])=>(

                                                        <span className="product-tag">
                                                            {name} x {qty as number}
                                                        </span>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-center">
                                               {
                                                Object.entries(paymentSummary).map(([method,count])=>(
                                                    <span key={method} className={`badge 
                                                    ${method === "ShopeeFood" ? "btn-warning btn-shopeefood" : 
                                                                            method === "GrabFood" ? "btn-primary btn-grabfood" :
                                                                            method === "GoFood" ? "btn btn-danger btn-gofood" :
                                                                            method === "Offline" ? "btn btn-secondary" :
                                                                            method === "QRIS" ? "badge-dark" : ""
                                                                        }`} style={{ fontSize: '10px' }}>
                                                        {method} ({count as number})
                                                    </span>
                                                ))
                                               }
                                            </td>
                                            <td className="text-end total-price">
                                                {
                                                    formatCurrency(transaction.reduce((sum, t) => sum + sumTransaction(t), 0))
                                                }
                                            </td>
                                            <td className="text-center">
                                                <button className="btn-details" onClick={()=>setSelectedDay({date, transaction})}>Details</button>
                                            </td>
                                        </tr>
                                        )})
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="summary-section">
                        <div className="row g-md-3 g-0">
                            <div className="col-4">
                                <div className="summary-card">
                                    <div className="summary-label">Total Revenue This Month</div>
                                    <div className="summary-value">{formatCurrency(
                                       filteredDataMonth.reduce((sum, t) => sum + sumTransaction(t), 0)
                                    )}</div>
                                    <div className="summary-hint">Sum of all daily revenues</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="summary-card">
                                    <div className="summary-label">Total Orders</div>
                                    <div className="summary-value">{
                                            filteredDataMonth.length
                                        }</div>
                                    <div className="summary-hint">Completed transactions this month</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="summary-card">
                                    <div className="summary-label">Total Products Sold</div>
                                    <div className="summary-value">
                                        {
                                            filteredDataMonth.reduce((sum,t)=>{
                                                return sum + t.items.reduce((s,item)=>(s + item.quantity),0)
                                            },0)
                                        }
                                    </div>
                                    <div className="summary-hint">Sum of all item quantities</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <CardDetailTransaction 
                        selectedDay={selectedDay} 
                        onClose={()=>setSelectedDay(null)}></CardDetailTransaction>
        </div>
    )
}

export default TransactionsPage;