import { useEffect, useState } from "react";
import { useAllMaterials } from "../api/useMaterial";
import { formatCurrency } from "./FormatCurrency";
import { useUpdateRecipe } from "../api/useRecipe";
import { Recipe,UpdateRecipePayload } from "../types/recipe";
import { Product } from "../types/product";
import { Material } from "../types/material";

interface Props {
    product: Product;
    recipes: Recipe[];
    isActiveShowRecipe: boolean;
    setIsActiveShowRecipe: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectedRecipe {
    material: Material;
    amount_used: number | "";
}

const CardCost = ({product,recipes, isActiveShowRecipe, setIsActiveShowRecipe}:Props)=>{
    
    const emptyMaterial: Material = {
    id: 0,
    name: '',
    price: 0,
    unit: '',
    amount: 1
};


    const {data, isPending:materialsIsLoading, error:materialsError} = useAllMaterials();
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
    const { mutate: updateRecipeMutate } = useUpdateRecipe();



    if(materialsError) {
        console.log("Error fetch data Material : ",materialsError)
    }
    const materials = data?? [];
    // console.log("Data Material",data)

    const hitungPokok = (used:number, amount:number, price:number):number=>{
    let hargaBahan = 0;
    if(used && amount && price){
      hargaBahan = used/amount * price;
    }
    return hargaBahan;
  }

  useEffect(()=>{
          setSelectedRecipes(
    recipes.map((recipe) => ({
      material: recipe.material,
      amount_used: recipe.amount_used,
    }))
  );
        console.log("ini adalah recipes : ", recipes);
  },[recipes]);
  
  useEffect(()=>{
    console.log(selectedRecipes);
  },[selectedRecipes]);




  const handleAddIngredient =  ()=>{
    setSelectedRecipes([...selectedRecipes, {material: emptyMaterial, amount_used: ""}]);
  }

  const handleChangeRecipes = (index: number, field: string, value:string )=>{
        const newRecipes = [...selectedRecipes];
        
        if(field==="material"){
            const materialObj =materials.find(m=>m.id === Number(value));
            newRecipes[index].material=materialObj;
        }
        if(field==="amount_used"){
            newRecipes[index].amount_used = Number(value);
        }

        setSelectedRecipes(newRecipes);
  }

  const totalHargaPokok = selectedRecipes.reduce((total, recipe) => {
    const used =
        recipe.amount_used === "" ? 0 : recipe.amount_used;

    return total + hitungPokok(
        used,
        recipe.material.amount,
        recipe.material.price
    );
}, 0);


    const handleCloseForm = ()=>{
        setIsActiveShowRecipe(!isActiveShowRecipe);
    }

    const handleDeleteRecipes = (index:number)=>{
        const newRecipes = [...selectedRecipes];
        newRecipes.splice(index,1);

        setSelectedRecipes(newRecipes);
    }

    const handleSubmit = async()=>{
       try{ 
        const payload:UpdateRecipePayload = {
            _method:"PUT",
            materials: selectedRecipes
                .filter(r => r.material?.id)
                .map(r => ({
                    id_material: r.material.id,     // FIX!
                    amount_used: Number(r.amount_used),
                }))
        };

        console.log("PAYLOAD FROM HANDLE:", payload);
        // console.log("Kirim", payload);
        // console.log(product.id);
        //request ke API

        updateRecipeMutate({
  id: product.id,
  data: payload,
});
        setIsActiveShowRecipe(false);
        setSelectedRecipes([{material:emptyMaterial, amount_used: ""}]);
    }catch(error){
        console.error(error);
        alert("Terjadi kesalahan saat menyimpan data");
    }

    }

    
    return (
        <>
        <main className="main-container position-absolute z-3 bg-light shadow-lg rounded-1 w-50">
        <div className="container-fluid" style={{maxWidth: "1200px"}}>
            <div className="d-flex justify-content-end align-items-end w-100 pe-3 pt-2">
                <p className=" btn-x btn-x-material text-primary d-block" onClick={handleCloseForm}>X</p>
            </div>
            <header className="mb-4">
            <h1 className="display-6 fw-semibold mb-2 text-primary">Edit Product Cost</h1>
            <p className="text-muted mb-0 text-primary">Manage ingredients and calculate product costs</p>
            </header>
            <section className="card shadow-sm mb-4">
            <div className="card-body">
            <h2 className="card-title h5 mb-4">Product Information</h2>
            <div className="row g-3">
            <div className="col-md-8"><label className="form-label fw-semibold text-primary2">Product Name</label>
                <div id="product-name" className="p-2 bg-light rounded">
                {product.product_name}
                </div>
            </div>
            <div className="col-md-4"><label className="form-label fw-semibold text-primary2">Selling Price</label>
                <div id="selling-price" className="p-2 bg-light rounded">
                {formatCurrency(product.price)}
                </div>
            </div>
            </div>
            </div>
            </section>
            <section className="card shadow-sm mb-4">
            <div className="card-body">
            <h2 className="card-title h5 mb-4">Ingredients</h2>
            <div className="table-responsive">
            <table className="table ingredient-table">
                <thead>
                <tr>
                <th style={{width: "30%"}}>Ingredient</th>
                <th style={{width: "15%"}}>Quantity</th>
                <th style={{width: "15%"}}>Unit</th>
                <th style={{width: "15%"}}>Cost</th>
                <th style={{width: "10%"}}></th>
                </tr>
                </thead>
                <tbody>
                { selectedRecipes ? ( 
                    selectedRecipes.map((recipe,index)=>(
                    <tr className="ingredient-row" key={index}>
                        <td>
                            <select className="form-select form-select-sm" aria-label="Select ingredient" value={recipe.material.id} onChange={(e) => handleChangeRecipes(index, "material", e.target.value)}> 
                            <option value="">-- Pilih Material --</option>
                            {
                                materialsIsLoading ? (<option>Loading...</option>) : (
                                    materials.map((material,index)=>(
                                        <>
                                            <option key={index}  
                                                    value={material.id}
                                            >{material.name}</option> 
                                        </>
                                        ))
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <input type="number" className="form-control form-control-sm" value={recipe.amount_used} onChange={(e)=> handleChangeRecipes(index,"amount_used", e.target.value)} min="0" step="0.01" aria-label="Quantity"/>
                        </td>
                        <td>
                            <span className="text-muted">{recipe.material?.unit|| "-"}</span>
                        </td>
                        <td className="text-end"><span className="fw-semibold">{
                        
                        formatCurrency(Math.round(Number(recipe.amount_used) * (Number(recipe.material.price) / Number(recipe.material.amount))))}</span></td>
                        <td>
                            <button className="btn btn-sm btn-outline-danger delete-btn" type="button" aria-label="Delete ingredient" onClick={()=>handleDeleteRecipes(index)}> 
                                <i className="bi bi-trash"></i> 
                            </button>
                        </td>
                    </tr>
                    ))
                ) : null
                }
                </tbody>
            </table>
            </div>
                <button className="btn btn-outline-primary mt-3" type="button" onClick={handleAddIngredient}> 
                    <i className="bi bi-plus-circle me-2"></i> <span>Add Ingredient</span> 
                </button>
            </div>
            </section>
            <section className="card shadow-sm mb-4">
            <div className="card-body">
            <h2 className="card-title h5 mb-4">Summary</h2>
            <div className="row g-3 profit-cost">
            <div className="col-md-5">
                <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                    <span className=" fw-semibold">Total Cost</span> <span className=" fw-bold">{formatCurrency(Number(totalHargaPokok.toFixed(0)))}</span>
                </div>
            </div>
            <div className="col-md-7">
                <div className="p-3 rounded d-flex justify-content-between align-items-center" style={{backgroundColor: "#d1fae5"}}>
                    <span className=" fw-semibold" style={{color: "#065f46"}}>Profit Margin</span> 
                    <span className=" fw-semibold" style={{color: "#059669"}}>{formatCurrency(product.price - Number(totalHargaPokok.toFixed(0)))}  ( {(((product.price - totalHargaPokok)/product.price)*100).toFixed(2)}% )</span>
                </div>
            </div>
            </div>
            </div>
            </section>
            <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-secondary" type="button" onClick={handleCloseForm}>Cancel</button> 
                <button className="btn btn-success" type="button" onClick={handleSubmit}> <span>Save Changes</span> </button>
            </div>
            
        </div>
        </main>
        </>
    )
}

export default CardCost;