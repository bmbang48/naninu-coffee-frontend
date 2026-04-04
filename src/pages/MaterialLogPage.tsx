import { useMaterialLogs } from "../api/useMaterialLog";
import { useDashboard } from "../api/useMaterialLog";
import { useState, useEffect } from "react";
import OperationalPage from "./OperationalPage";

const MaterialLogPage = () => {

  const [page,setPage] = useState(1);
  const [filter, setFilter] = useState({
    material_id: "",
    type: "",
    start_date: "",
    end_date: ""  
  });

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

  const { data, isLoading } = useMaterialLogs({...filter,page});
  // console.log(dataDashboard)

  const logs = data?.data ?? [];
  useEffect(() => {
  setPage(1);
    }, [filter]);

  return (
    <>
    <OperationalPage/>
    
    
    
    <div className="p-4 container mt-3">

      <h5>Material Logs</h5>

      {/* 🔥 FILTER */}
      <div className="d-flex gap-2 mb-3">

        <select 
          className="form-control"
          value={filter.type}
          onChange={(e)=>setFilter({...filter, type:e.target.value})}
        >
          <option value="">All</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

      </div>
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

      {/* 🔥 TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr><td>Loading...</td></tr>
          ) : logs.map((log:any)=>(
            <tr key={log.id}>
              <td>
                {new Date(log.created_at).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })} WIB
              </td>
              <td>{log.material?.name}</td>
              <td>
                <span className={`badge ${log.type === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                  {log.type}
                </span>
              </td>
              <td>{log.amount}</td>
              <td>{log.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <div className="d-flex justify-content-center mt-3 w-100">

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
    </>
  );
};

export default MaterialLogPage;