import { baseUrl } from "../api/baseUrl";
import { formatCurrency } from "./FormatCurrency";
import { useDeleteRecipe} from "../api/useRecipe";
import { useState } from "react";
import ConfirmationAlert from "./ConfirmationAlert";
import CardCost from "./CardCost";
import { Product } from "../types/product";
import { Recipe } from "../types/recipe";

interface Props{
  product: Product;
  recipes: Recipe[];
}

const CardHpp = ({product, recipes}:Props) => {
  const hitungPokok = (used, amount, price)=>{
    let hargaBahan = 0;
    if(used && amount && price){
      hargaBahan = used/amount * price;
    }
    return hargaBahan;
  }

  const totalHargaPokok = recipes.reduce((total, recipe) => {
      return total + hitungPokok(recipe.amount_used, recipe.material.amount, recipe.material.price);
    }, 0);

  const keuntungan = product.price - totalHargaPokok;

  const { mutate: deleteRecipe, isPending: deleteIsLoading } = useDeleteRecipe();
  
  // const { data: recipe, isLoading: recipeIsLoading } = useShowRecipe(product.id);
  const [id, setId] = useState(0);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isActiveConfirmDelete, setIsActiveConfirmDelete] = useState(false);
  const [isActiveShowRecipe, setIsActiveShowRecipe] = useState(false);

  const handleActiveConfirmDelete = (id:number) =>{
    console.log(id);
    setId(id);
    setIsActiveConfirmDelete(!isActiveConfirmDelete);
    console.log(isActiveConfirmDelete);
  }

  if(isConfirmDelete){
    // console.log('Delete');
    deleteRecipe(id);
    setIsConfirmDelete(false);
  }

  const handleShowRecipe = () => {
    // console.log(id);
    setIsActiveShowRecipe(true);
    // showRecipe(id);
    // console.log(idProduct);
    // console.log(showRecipe);
    // setFormData({});
  }

  // console.log(product, recipes);
  return (
    <>
        {isActiveConfirmDelete ? <ConfirmationAlert 
            isConfirm={isActiveConfirmDelete} 
            setIsConfirm={setIsActiveConfirmDelete}
            isConfirmDelete={isConfirmDelete}
            setIsConfirmDelete={setIsConfirmDelete}/> : null}
      {deleteIsLoading && <p>Deleting...</p>}
      <div className="card col-lg-3 col-6 product-card rounded-3 align-items-between justify-content-between shadow-sm h-100 p-0 pt-2 m-0 ">
    
        <div className="product-image hpp d-flex justify-content-center w-100 bg-transparent pt-2 overflow-visible">
        <img src={`${baseUrl}/storage/products/${product.image}`} className="img-product-hpp" alt="..."/>
        </div>
        <div className="card-body d-flex flex-column justify-content-between ">
            <h5 className="card-title fw-bold" >{product.product_name}</h5>
            <p className="card-text text-muted small mb-0">{product.description}</p>
                        <div className="stats-container">
                            <div className="row text-center profit-card">
                                <div className="col-4 p-0 stat-item">
                                    <div className="stat-label">Cost</div>
                                    <div className="stat-value cost-value">
                                        {formatCurrency(Math.round(totalHargaPokok))}</div>
                                </div>
                                <div className="col-4 p-0 stat-item">
                                    <div className="stat-label">Price</div>
                                    <div className="stat-value">
                                        {formatCurrency(Math.round(product.price))}
                                    </div>
                                </div>
                                <div className="col-4 p-0 stat-item">
                                    <div className="stat-label">Profit</div>
                                    <div className="stat-value profit-value">
                                      {formatCurrency(Math.round(keuntungan))}
                                    </div>
                                </div>
                            </div>
                        </div>
              <div className="d-grid gap-2">
                            <button className="btn btn-success btn-sm btn-profit" onClick={() => handleShowRecipe()}>
                                <i className="bi bi-pie-chart me-1"></i>Cost Details
                            </button>
                            <button className="btn btn-danger btn-sm btn-profit" onClick={()=>handleActiveConfirmDelete(product.id)}>
                                <i className="bi bi-trash"></i>Delete Recipe
                            </button>
                        </div>
        </div>
    </div>  
    {
      isActiveShowRecipe && (
        <CardCost product={product} recipes={recipes??[]} isActiveShowRecipe={isActiveShowRecipe}  setIsActiveShowRecipe={setIsActiveShowRecipe}/>
      )
    }
    </>
  );
}  
export default CardHpp;