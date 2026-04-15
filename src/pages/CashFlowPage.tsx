import { useCashflows,useCashflowSummary,useCreateCashflow,useCashflowChart } from "../api/useCashFlow";
import { useState,useEffect } from "react";
import { formatCurrency } from "../components/FormatCurrency";
import { useCashflow } from "../api/useDashboard";
import { getDateRange } from "../api/getDate";
import CashFlowChart from "../components/CashFlowChart";
import OtherCostPage from "./OtherCostPage";
const CashFlowPage = ()=>{
    
    const [page,setPage] = useState(1);
    const [filter, setFilter] = useState({
    start_date: "",
    end_date: ""
    });
    const { data, isLoading } = useCashflows({...filter, page});
    const { data: summary } = useCashflowSummary();
    const createCashflow = useCreateCashflow();
    const { data: chartData } = useCashflowChart(filter);
    const { data:cashflow } = useCashflow(filter);
    const getPages = () => {
        const total = data?.last_page || 1;
        const current = data?.current_page || 1;
        const delta = 2;

        const pages = [];

        if (current > 3) {
            pages.push(1);
            pages.push("...");
        }

        for (
            let i = Math.max(1, current - delta);
            i <= Math.min(total, current + delta);
            i++
        ) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push("...");
            pages.push(total);
        }

        return pages;
        };

    const [form, setForm] = useState({
    type: "OUT",
    amount: "",
    category: "",
    note: "",
    date: ""
    });
    useEffect(() => {
    setPage(1);
    }, [filter]);

    

    useEffect(() => {
        setFilter(getDateRange("month"));
        }, []);

    return (
        <>
                    <div className="row mb-3">
                <div className="col">
                    <div className="card p-3">
                    <h6>Cash In</h6>
                    <h5>{formatCurrency(summary?.cash_in)}</h5>
                    </div>
                </div>

                <div className="col">
                    <div className="card p-3">
                    <h6>Cash Out</h6>
                    <h5>{formatCurrency(summary?.cash_out)}</h5>
                    </div>
                </div>

                <div className="col">
                    <div className="card p-3 bg-dark text-white">
                    <h6>Balance</h6>
                    <h4>{formatCurrency(summary?.balance)}</h4>
                    </div>
                </div>

            </div>
            <CashFlowChart data={chartData} />
            <div className="card p-3 mt-3 mb-3">

                <h5>Add Cashflow</h5>

                <div className="row g-2">

                    <div className="col">
                    <select
                        className="form-control"
                        value={form.type}
                        onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                        }
                    >
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                    </select>
                    </div>

                    <div className="col">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                        }
                    />
                    </div>

                    <div className="col">
                    <input
                        className="form-control"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                        }
                    />
                    </div>

                    <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={form.date}
                        onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-12">
                    <input
                        className="form-control"
                        placeholder="Note"
                        value={form.note}
                        onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-12">
                    <button
                        className="btn btn-success w-100"
                        onClick={async () => {
                        await createCashflow.mutateAsync(form);

                        // reset form
                        setForm({
                            type: "OUT",
                            amount: "",
                            category: "",
                            note: "",
                            date: ""
                        });
                        }}
                    >
                        Submit
                    </button>
                    </div>

                </div>

                </div>

            <div className="d-flex gap-2 mb-3">

                <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setFilter(getDateRange("today"))}
                >
                    Today
                </button>

                <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setFilter(getDateRange("week"))}
                >
                    This Week
                </button>

                <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setFilter(getDateRange("month"))}
                >
                    This Month
                </button>

                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setFilter({ start_date: "", end_date: "" })}
                >
                    All
                </button>

                </div>
            <div className="row">
                <div className="d-flex gap-2 mb-3">
                <input
                    type="date"
                    className="form-control"
                    value={filter.start_date}
                    onChange={(e) =>
                    setFilter({ ...filter, start_date: e.target.value })
                    }
                />

                <input
                    type="date"
                    className="form-control"
                    value={filter.end_date}
                    onChange={(e) =>
                    setFilter({ ...filter, end_date: e.target.value })
                    }
                />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Note</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                            <tr><td>Loading...</td></tr>
                            ) : data?.data.map((item:any) => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>
                                <span className={`badge ${item.type === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                                    {item.type}
                                </span>
                                </td>
                                <td>{formatCurrency(item.amount)}</td>
                                <td>{item.category}</td>
                                <td>{item.note}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center mt-3">

                        <button
                            className="btn btn-sm btn-secondary me-2"
                            disabled={data?.current_page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>
                        {getPages().map((pageNum, i) =>
                            pageNum === "..." ? (
                                <span key={i} className="mx-1">...</span>
                            ) : (
                                <button
                                key={i}
                                className={`btn btn-sm me-1 ${
                                    data?.current_page === pageNum
                                    ? "btn-success"
                                    : "btn-outline-success"
                                }`}
                                onClick={() => setPage(pageNum)}
                                >
                                {pageNum}
                                </button>
                            )
                        )}
                        <button
                            className="btn btn-sm btn-secondary ms-2"
                            disabled={data?.current_page === data?.last_page}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="card p-3">
                  <h6>Income</h6>
                  <h4>{formatCurrency(cashflow?.income)}</h4>
                </div>
              </div>
      
              <div className="col">
                <div className="card p-3">
                  <h6>HPP</h6>
                  <h4>{formatCurrency(cashflow?.hpp)}</h4>
                </div>
              </div>
      
              <div className="col">
                <div className="card p-3">
                  <h6>Other Cost</h6>
                  <h4>{formatCurrency(cashflow?.other_cost)}</h4>
                </div>
              </div>
      
              <div className="col">
                <div className={`card p-3 ${cashflow?.net_profit >= 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                  <h6>Net Profit</h6>
                  <h4>{formatCurrency(cashflow?.net_profit)}</h4>
                </div>
              </div>
        </div>
                <OtherCostPage/>
        </>
    );
}

export default CashFlowPage;