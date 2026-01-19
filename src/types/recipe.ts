import { Material } from "./material";

export interface Recipe{
    material : Material;
    amount_used: number;
}

// untuk material dalam recipe
export interface RecipeMaterialPayload {
  id_material: number;
  amount_used: number;
}

// payload kirim ke backend
export interface StoreRecipePayload {
  id_product: number;
  materials: RecipeMaterialPayload[];
}
export interface UpdateRecipePayload {
  _method?: 'PUT';
  materials: {
    id_material: number;
    amount_used: number;
  }[];
}
