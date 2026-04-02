import CardHpp from "../components/CardHpp";
import MaterialPage from "./MaterialPage";
import { useRecipes } from "../api/useRecipe";
import { useState,useMemo } from "react";
import FormRecipe from "../components/FormRecipe";
import { Product } from "../types/product";
import { Recipe } from "../types/recipe";
import ProductPage from "./ProductPage";

interface GroupedProduct{
    product: Product;
    recipes: Recipe[];
}

const ProductionPage = () => {

    const {data: recipes, isLoading: recipesIsLoading, error: recipesError} = useRecipes();
    // console.log(recipes);
    const [isActiveForm, setIsActiveForm] = useState(false);
    const handleForm = () =>{
        setIsActiveForm(!isActiveForm);
    }

    console.log("Ini Recipes",recipes);

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

console.log("Ini Group",groupedByProduct);



    return (
        <div className="d-flex flex-column">
            <div className="container main-container flex-grow-1">
                <div className="row">
                    <h1 className="page-title">Management Production</h1>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <MaterialPage/>
                    </div>
                    <div className="col-md-6">
                        <ProductPage/>
                    </div>
                </div>
                <div className="row mt-3 mt-md-4">
                    <div className="col-12">
                        { isActiveForm && <FormRecipe isActiveForm={isActiveForm} setIsActiveForm={setIsActiveForm} />}
                        <div className="title">
                            <button className="btn btn-success" onClick={handleForm}><i className="bi bi-plus-circle me-2"></i>Add Product Recipe</button>
                        </div>
                    </div>
                    <div className="col-12 mt-3 ">
                        <div className="d-flex flex-wrap justify-content-between ">
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
export default ProductionPage;