import { useOtherCosts, useDeleteOtherCost } from "../api/useOtherCost"
import { useState } from "react";
import FormOtherCost from "../components/FormOtherCost";
import ConfirmationAlert from "../components/ConfirmationAlert";
import { formatCurrency } from "../components/FormatCurrency";

const OtherCostPage = () => {

    const {data: otherCosts, isLoading: otherCostsIsLoading, error: otherCostsError} = useOtherCosts();
    const {mutate: deleteOtherCost} = useDeleteOtherCost();
    const [isActiveForm, setIsActiveForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [id, setId] = useState(0);
    const [isActiveConfirmDelete, setIsActiveConfirmDelete] = useState(false);
    const handleAddCost = () => {
        setIsActiveForm(!isActiveForm); 
    }

    const handleActiveConfirmDelete = (id:number) =>{
        setId(id);
        setIsActiveConfirmDelete(!isActiveConfirmDelete);
    }

    if(isConfirmDelete){
        console.log('Delete');
        deleteOtherCost(id);
        setIsConfirmDelete(false);
    }

    const handleEditCost = (formData:object) =>{
        // console.log(formData);
        setFormData(formData);
        setIsActiveForm(!isActiveForm);
    }

    return (
        <div className="card section-card rounded-3 mt-5 shadow-sm">
            {isActiveForm && 
                <FormOtherCost 
                isActiveForm={isActiveForm} 
                setIsActiveForm={setIsActiveForm} 
                formData={formData}
                mode={Object.keys(formData).length === 0 ? 'create' : 'edit'}
                />}

            {isActiveConfirmDelete ?
                <ConfirmationAlert 
                isConfirm={isActiveConfirmDelete}
                setIsConfirm={setIsActiveConfirmDelete}
                isConfirmDelete={isConfirmDelete}
                setIsConfirmDelete={setIsConfirmDelete}
                /> : null
            }
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    Other Cost
                </h5>
                    <button className="btn btn-success my-0" onClick={handleAddCost}>
                        <i className="bi bi-plus-circle me-2"></i>Add Cost
                    </button>
            </div>
            {otherCostsError && <p>Error: {otherCostsError.message}</p>}
            
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="px-3 py-3" scope="col">No</th>
                            <th className="px-3 py-3" scope="col">Cost Name</th>
                            <th className="px-3 py-3" scope="col">Price</th>
                            <th className="px-3 py-3" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherCostsIsLoading ? 
                            (<tr> 
                                <td colSpan={3}><p>Loading...</p></td>
                            </tr>  ) : 
                        otherCosts.map((cost, index)=>(
                            <tr key={cost.id}>
                                <td className="px-3 py-3" scope="col">{index + 1}</td>
                                <td className="px-3 py-3" scope="col">{cost.name_cost}</td>
                                <td className="px-3 py-3" scope="col">{formatCurrency(cost.amount)}</td>
                                <td className="px-3 py-3">
                                    <button className="btn btn-warning btn-sm me-2" onClick={()=>handleEditCost(cost)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={()=>handleActiveConfirmDelete(cost.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}   
export default OtherCostPage