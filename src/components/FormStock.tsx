import { useState } from "react";
import api from "../api/axios";

const FormStock = ({ material, mode, onClose }: any) => {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("IN");
  const [note, setNote] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      if (mode === "restock") {
        await api.post("/materials/restock", {
          material_id: material.id,
          amount: Number(amount),
          note: note
        });
      } else {
        await api.post("/materials/adjust", {
          material_id: material.id,
          type: type,
          amount: Number(amount),
          note: note
        });
      }

      onClose();
      window.location.reload(); // quick refresh (nanti bisa refetch query)

    } catch (err:any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="form-material d-flex flex-column align-items-center w-100">
      
      <div className="d-flex justify-content-end w-100 pe-3 pt-2">
        <p className="btn-x" onClick={onClose}>X</p>
      </div>

      <form className="w-75" onSubmit={handleSubmit}>
        
        <h5 className="mb-3">
          {mode === "restock" ? "Restock" : "Adjust Stock"} - {material.name}
        </h5>

        {mode === "adjust" && (
          <div className="mb-3">
            <label>Type</label>
            <select 
              className="form-control"
              value={type}
              onChange={(e)=>setType(e.target.value)}
            >
              <option value="IN">IN (Tambah)</option>
              <option value="OUT">OUT (Kurang)</option>
            </select>
          </div>
        )}

        <div className="mb-3">
          <label>Amount</label>
          <input 
            type="number"
            className="form-control"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Note</label>
          <input 
            type="text"
            className="form-control"
            value={note}
            onChange={(e)=>setNote(e.target.value)}
          />
        </div>

        <button className="btn btn-success w-100">
          Submit
        </button>

      </form>
    </div>
  );
};

export default FormStock;