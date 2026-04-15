import { useTransactions } from "../api/useTransaction";
import { useState } from "react";
import { formatCurrency,formatLocalDate } from "../components/FormatCurrency";
import {getDayName} from "../api/getDate";
import CardDetailTransaction from "../components/CardDetailTransaction";
import { Product } from "../types/product";

interface MethodStats {
    totalRevenue:number;
    totalOrders:number;
}

interface StatsAccumulator{
    [key:string]: MethodStats;
}

interface Transaction{
    id: number;
    customer_name: string ;
    pay: number;
    total_price: number;
    total_profit: number;
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

    const sumTotal = filteredDataMonth.reduce((sum,transaction)=> sum + transaction.total_price,0);
    const sumProfit = filteredDataMonth.reduce((sum,transaction)=> 
        // console.log(transaction.total_profit),0);
        sum + parseFloat(transaction.total_profit),0);
    console.log(sumTotal);   

    const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

    const monthlyPaymentSummary =filteredDataMonth.reduce((acc: StatsAccumulator,t)=>{
        const method = t.payment_method || "cash";

        if(!acc[method]){
            acc[method]={
                totalOrders:0,
                totalRevenue:0
            };
        }

        acc[method].totalOrders += 1;
        acc[method].totalRevenue += t.total_price;
        
        return acc;
    }, {} as StatsAccumulator);


    const productSoldByPayment = filteredDataMonth.reduce((acc,t)=>{
        const method = t.payment_method || "Cash";

        if(!acc[method]){
            acc[method] = 0;
        }

        const totalQtyInTransaction = t.items.reduce(
            (sum,item)=> sum + Number(item.quantity),0
        );

        acc[method] += totalQtyInTransaction;

        return acc;
    }, {} as Record<string, Record<string, number>>);

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
                                        <th className="text-center pe-5 d-none d-md-block">Payment</th>
                                        <th className="text-end">Total Price</th>
                                        <th className="text-end">Total Profit</th>
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
                                                const method = t.payment_method || "Cash";
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
                                                transaction.reduce((sum,t)=> sum + t.items.reduce((s,item)=> s+ Number(item.quantity),0),0)
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
                                            <td className="text-center payment-method d-none d-md-block">
                                               {
                                                Object.entries(paymentSummary).map(([method,count])=>(
                                                    <span key={method} className={`badge
                                                    ${method === "ShopeeFood" ? "btn-warning btn-shopeefood" : 
                                                                            method === "GrabFood" ? "btn-primary btn-grabfood" :
                                                                            method === "GoFood" ? "btn btn-danger btn-gofood" :
                                                                            method === "Cash" ? "btn btn-secondary" :
                                                                            method === "QRIS" ? "btn btn-dark" : ""
                                                                        }`} style={{ fontSize: '10px' }}>
                                                        {method} ({count as number})
                                                    </span>
                                                ))
                                               }
                                            </td>
                                            <td className="text-end total-price">
                                                {
                                                    formatCurrency(transaction.reduce((sum, t) => sum + t.total_price,0))
                                                }
                                            </td>
                                            <td className="text-end total-price">
                                                {
                                                    formatCurrency(transaction.reduce((sum, t) => sum + Number(t.total_profit),0))
                                                }
                                            </td>
                                            <td className="text-center">
                                                <button className="btn-details" onClick={()=>setSelectedDay({
                                                            date,
                                                            transaction: [...transaction] 
                                                        })}>Details</button>
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
                            <div className="col-12 col-md-4">
                                <div className="summary-card d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between pe-2">
                                        <div className="summary-label">Total Revenue This Month</div>
                                        <div className="summary-value">{sumTotal === 0 ? "Rp. 0" : formatCurrency(sumTotal)}</div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        {
                                            (Object.entries(monthlyPaymentSummary) as [string,MethodStats][]).map(([method,data])=>(
                                                <div className={`revenue-by-payment fw-semibold ${method === 'Cash' ? "text-secondary" : 
                                                                    method === 'QRIS' ? "text-dark" :
                                                                    method === 'ShopeeFood' ? "text-warning" :
                                                                    method === 'GoFood' ? "text-danger" :
                                                                    method === 'GrabFood' ? "text-success" : ""
                                                    }`}>
                                                    <p>{method}</p>
                                                    <p>{formatCurrency(data.totalRevenue)}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="d-flex justify-content-between pe-2">
                                        <div className="summary-label">Total Profit This Month</div>
                                        <div className="summary-value">{sumProfit === 0 ? "Rp. 0" : formatCurrency(sumProfit)}</div>
                                    </div>

                                    <div className="summary-hint">Sum of all daily revenues</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="summary-card d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between pe-4">
                                        <div className="summary-label">Total Orders</div>
                                        <div className="summary-value">{
                                                filteredDataMonth.length
                                            }</div>
                                    </div>
                                    <div className="d-flex flex-wrap">
                                        {                                (Object.entries(monthlyPaymentSummary) as [string,MethodStats][]).map(([method,data])=>(
                                            <span key={method} className={`badge me-2 mb-2
                                                ${method === "ShopeeFood" ? "btn-warning btn-shopeefood" : 
                                                method === "GrabFood" ? "btn-primary btn-grabfood" :
                                                method === "GoFood" ? "btn btn-danger btn-gofood" :
                                                method === "Cash" ? "btn btn-secondary btn-sm" :
                                                method === "QRIS" ? "btn btn-dark btn-sm" : ""
                                            }`}>
                                                {method} ({data.totalOrders})
                                            </span>
                                        ))}
                                    </div>
                                    <div className="summary-hint">Completed transactions this month</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="summary-card d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between pe-4">
                                        <div className="summary-label">Total Products Sold</div>
                                        <div className="summary-value">
                                            {
                                                filteredDataMonth.reduce((sum,t)=>{
                                                    return sum + t.items.reduce((s,item)=>(s + item.quantity),0)
                                                },0)
                                            }
                                        </div>
                                        </div>
                                    <div className="d-flex flex-wrap ">
                                        {Object.entries(productSoldByPayment).map(([method, total])=>(
                                            <span key={method} className={`badge me-2 mb-2
                                                ${method === "ShopeeFood" ? "btn-warning btn-shopeefood" : 
                                                method === "GrabFood" ? "btn-primary btn-grabfood" :
                                                method === "GoFood" ? "btn btn-danger btn-gofood" :
                                                method === "Cash" ? "btn btn-secondary btn-sm" :
                                                method === "QRIS" ? "btn btn-dark btn-sm" : ""
                                            }`}>
                                                {method} ({total as number})
                                            </span>
                                        ))}
                                    </div>
                                    <div className="summary-hint">Sum of all item quantities</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <CardDetailTransaction 
                        key={selectedDay?.date}
                        selectedDay={selectedDay} 
                        onClose={()=>setSelectedDay(null)}></CardDetailTransaction>
        </div>
    )
}

export default TransactionsPage;