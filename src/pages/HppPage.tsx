import CardHpp from "../components/CardHpp";
import MaterialPage from "./MaterialPage";
import OtherCostPage from "./OtherCostPage";
import { useRecipes } from "../api/useRecipe";
import { useState,useMemo } from "react";
import FormRecipe from "../components/FormRecipe";
import { Product } from "../types/product";
import { Recipe } from "../types/recipe";

interface GroupedProduct{
    product: Product;
    recipes: Recipe[];
}

const HppPage = () => {

    const {data: recipes, isLoading: recipesIsLoading, error: recipesError} = useRecipes();
    // console.log(recipes);
    const [isActiveForm, setIsActiveForm] = useState(false);
    const handleForm = () =>{
        setIsActiveForm(!isActiveForm);
    }


const groupedByProduct = useMemo<
  Record<number, GroupedProduct>
>(() => {
  if (!recipes) return {};

  return recipes.reduce((acc, item) => {
    const productId = item.product.id;

    if (!acc[productId]) {
      acc[productId] = {
        product: item.product,
        recipes: [],
      };
    }

    acc[productId].recipes.push({
      material: item.material,
      amount_used: item.amount_used,
    });

    return acc;
  }, {} as Record<number, GroupedProduct>);
}, [recipes]);




    return (
        <div className="d-flex flex-column">
            <div className="container main-container flex-grow-1">
                <div className="row">
                    <h1 className="page-title">Management Cost & Benefit</h1>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <MaterialPage/>
                    </div>
                    <div className="col-md-6">
                        <OtherCostPage/>
                    </div>
                </div>
                <div className="row">
                    <div className="container text-center d-flex flex-column justify-content-center align-items-start flex-wrap gap-3 mt-4">
                        { isActiveForm && <FormRecipe isActiveForm={isActiveForm} setIsActiveForm={setIsActiveForm} />}
                        <div className="title">
                            <button className="btn btn-success" onClick={handleForm}><i className="bi bi-plus-circle me-2"></i>Add Product Recipe</button>
                        </div>
                        <div className="container  row justify-content-center align-items-start">
                            { recipesError ? (<p>Oops, Terjadi Kesalahan pada recipe</p>) : recipesIsLoading ? (<p>Loading...</p>) : 
                            Object.values(groupedByProduct).map((group)=>(
                                <CardHpp key={group.product.id} product={group.product} recipes={group.recipes}/>
                            ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );

}
export default HppPage;