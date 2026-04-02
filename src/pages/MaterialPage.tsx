import { useMaterials,useDeleteMaterial } from "../api/useMaterial";
import { useState } from "react";
import FormMaterial from "../components/FormMaterial";
import ConfirmationAlert from "../components/ConfirmationAlert";
import { formatCurrency } from "../components/FormatCurrency";
import FormStock from "../components/FormStock";

const MaterialPage = () => {

    const [page, setPage] = useState(1);
    const {data, isLoading:materialsIsLoading, error: materialsError} = useMaterials(page);

    // console.log(data);
    const materials = data?.data ?? [];
    const currentPage = data?.current_page ?? 1;
    const lastPage = data?.last_page ?? 1;
    const [isStockForm, setIsStockForm] = useState(false);
    const [stockMode, setStockMode] = useState<'restock' | 'adjust'>('restock');
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

    const {mutate: deleteMaterial } = useDeleteMaterial();

    const [isActiveForm, setIsActiveForm] = useState(false);

    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [id, setId] = useState(0);
    const [isActiveConfirmDelete, setIsActiveConfirmDelete] = useState(false);

    const [formData, setFormData] = useState({});
    const handleActiveConfirmDelete = (id:number) => {
        setId(id);
        setIsActiveConfirmDelete(!isActiveConfirmDelete);
    }
    if(isConfirmDelete){
        console.log('Delete');
        deleteMaterial(id);
        setIsConfirmDelete(false);
    }

    const handleAddMaterial = () => {
        setFormData({});
        setIsActiveForm(!isActiveForm);
    }


    const handleEditMaterial = (formData:object) => {
        // console.log(formData);
        setFormData(formData);
        setIsActiveForm(!isActiveForm);
    }

    const handleRestock = (material:any) => {
    setSelectedMaterial(material);
    setStockMode('restock');
    setIsStockForm(true);
    };

    const handleAdjust = (material:any) => {
    setSelectedMaterial(material);
    setStockMode('adjust');
    setIsStockForm(true);
    };

    return (
        <div className="card section-card rounded-3 shadow-sm">
            <div className="card-header py-3 d-flex justify-content-between align-items-center flex-row">
                    <h5 className="mb-0">
                    <i className="bi bi-box-seam me-2"></i>Material Page
                </h5>
                    
                <button className="btn btn-success my-0" onClick={handleAddMaterial}>
                    <i className="bi bi-plus-circle me-2"></i>Add Material
                </button>
            </div>

        {isActiveForm && 
            <FormMaterial 
            isActiveForm={isActiveForm} 
            setIsActiveForm={setIsActiveForm} 
            formData={formData}
            mode={Object.keys(formData).length === 0 ? 'create' : 'edit'}
            />}
        
        {isActiveConfirmDelete ? <ConfirmationAlert 
            isConfirm={isActiveConfirmDelete} 
            setIsConfirm={setIsActiveConfirmDelete}
            isConfirmDelete={isConfirmDelete}
            setIsConfirmDelete={setIsConfirmDelete}/> : null}
        {materialsError && <p>Error: {materialsError.message}</p>}

        {isStockForm && (
            <FormStock
                material={selectedMaterial}
                mode={stockMode}
                onClose={() => setIsStockForm(false)}
            />
            )}
        <div className="card-body p-0">

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="px-3 py-3" scope="col">No</th>
                            <th className="px-3 py-3" scope="col">Material Name</th>
                            <th className="px-3 py-3" scope="col">Price</th>
                            <th className="px-3 py-3" scope="col">Unit</th>
                            <th className="px-3 py-3" scope="col">Stock</th>
                            <th className="px-3 py-3 text-center" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materialsIsLoading ? 
                            (<tr> 
                                <td><p>Loading...</p></td>
                            </tr>  ) : 
                        materials.map((material, index)=>(
                            <tr key={index}>
                                <td className="px-3 py-3" scope="col">{index + 1}</td>
                                <td className="px-3 py-3" scope="col">{material.name}</td>
                                <td className="px-3 py-3" scope="col">{formatCurrency(material.price)}</td>
                                <td className="px-3 py-3" scope="col">{material.amount} {material.unit}</td>
                                <td className="px-3 py-3" scope="col">{material.stock} {material.unit}</td>
                               
                                <td className="py-3 px-3 w-100 h-100 text-center" scope="col">
                                    <button 
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleRestock(material)}
                                        >
                                        <i className="bi bi-plus"></i>
                                        </button>

                                        <button 
                                        className="btn btn-secondary btn-sm me-2"
                                        onClick={() => handleAdjust(material)}
                                        >
                                        <i className="bi bi-sliders"></i>
                                        </button>
                                    <button className="btn btn-warning btn-sm me-2" onClick={()=>handleEditMaterial(material)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm me-2" onClick={()=>handleActiveConfirmDelete(material.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    
                    </tbody>
                </table>
            </div>
        </div>
         <div className="col-12 mt-3">
                {lastPage === 1 ? null : (
                    <nav aria-label="Product pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <a className="page-link"
                                onClick={() => setPage((old)=> old - 1)}
                                >
                                    {"<"}
                            </a>
                        </li>
                        {Array.from({length:lastPage}, (_, i)=>(
                            <li key={i} onClick={()=>setPage(i+1)}>
                                <a className={`px-2 page-link ${page === i+1 ? "font-bold underline" : ""}`}>
                                    {i+1}
                                </a>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                            <a className="page-link"
                                onClick={()=> setPage((old)=> old + 1)}
                                >
                                {">"}
                            </a>
                        </li>
                    </ul>
                </nav>
                )}
            </div>
        
        </div>
    );
}
export default MaterialPage;