import { useState } from "react";
import { useStoreRecipe } from "../api/useRecipe";
import { useProducts } from "../api/useProduct";
import { useAllMaterials } from "../api/useMaterial";
import { Product } from "../types/product";
import { Material } from "../types/material";
import { StoreRecipePayload } from "../types/recipe";


interface Props {
        isActiveForm: boolean;
        setIsActiveForm: (isActiveForm: boolean) => void;
    }
const RecipeForm = ({ isActiveForm, setIsActiveForm} : Props) => {

    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedMaterials, setSelectedMaterials] = useState([{ id_material: "", amount_used: "" }]);

    const {data: dataProducts, isLoading:productsIsLoading, error: productsError} = useProducts();
    const listProduct = dataProducts?.data??[];

    const {data: dataMaterials, isPending:materialsIsLoading, error: materialsError} = useAllMaterials();

    const { mutate: storeRecipe } = useStoreRecipe();

    // const dataMaterials
    

    const handleAddMaterial = () => {
        setSelectedMaterials([...selectedMaterials, { id_material: "", amount_used: "" }]);
    };

    const handleChangeMaterial = (index: number, field: string, value: string) => {
        const newMaterials = [...selectedMaterials];
        newMaterials[index][field] = value;
        setSelectedMaterials(newMaterials);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: StoreRecipePayload = {
            id_product: Number(selectedProduct),
            materials: selectedMaterials.map(m => ({
                id_material: Number(m.id_material),
                amount_used: Number(m.amount_used)
            }))
            };

storeRecipe(payload);

        setSelectedProduct("");
        setSelectedMaterials([{ id_material: "", amount_used: "" }]);
        if(isActiveForm){
            setIsActiveForm(false);
        }
    };

    const handleCloseForm = ()=>{
        setIsActiveForm(!isActiveForm);
    }

    return (
        <div className="form-recipe d-flex flex-column justify-content-center align-items-center rounded ">
            <div className="d-flex justify-content-end align-items-end w-100 pe-3 pt-2">
                <p className=" btn-x btn-x-material d-block" onClick={handleCloseForm}>X</p>
            </div>
        <form onSubmit={handleSubmit} className="px-4 ">
            <h5>Tambah Resep</h5>
            <div className="mb-3">
                <label className="mb-3">Produk</label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="form-control">
                    <option value="">-- Pilih Produk --</option>
                    {
                        productsIsLoading ? (
                            <option value="">Loading...</option>
                        ) : 
                        productsError ? (
                            <option value="">{productsError.message}</option>
                        ) : 
                        (listProduct.data as Product[] | undefined)?.map((p) => (
                        <option key={p.id} value={p.id}>{p.product_name}</option>
                        ))
                    }
                </select>
            </div>

            {materialsError ? (<p>Oops Error Materials</p>) : materialsIsLoading ? <p>Loading...</p> : selectedMaterials.map((mat, i) => (
                <div key={i} className="mb-3 d-flex gap-2">
                    <select className="form-control" value={mat.id_material}
                        onChange={(e) => handleChangeMaterial(i, "id_material", e.target.value)}>
                        <option value="">-- Pilih Material --</option>
                        {(dataMaterials as Material[] | undefined)?.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Jumlah"
                        className="form-control"
                        value={mat.amount_used}
                        onChange={(e) => handleChangeMaterial(i, "amount_used", e.target.value)}
                    />
                </div>
            ))}

            <button type="button" onClick={handleAddMaterial} className="btn btn-secondary mb-3">+ Tambah Material</button>
            <br />
            <button type="submit" className="btn btn-success w-75">Simpan</button>
        </form>
        </div>
    );
};

export default RecipeForm;
