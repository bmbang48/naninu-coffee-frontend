  import { useProducts,useDeleteProduct } from "../api/useProduct";
  import { baseUrl } from "../api/baseUrl";
  import { useState } from "react";
  import FormProduct from "../components/FormProduct";
import ConfirmationAlert from "../components/ConfirmationAlert";
import { formatCurrency } from "../components/FormatCurrency";
import { Product } from "../types/product";


  const ProductPage = () => {
    const [page,setPage] = useState(1);
    const {data: products, isLoading:productsIsLoading, error: productsError} = useProducts(page);
    // console.log(products);
    // productsIsLoading ? console.log('Loading...') : console.log(products.data);
    const items = products?.data??[];
    const currentPage = products?.data?.current_page ?? 1;
    const lastPage = products?.data?.last_page ?? 1;
    console.log(products);

    const [isActiveForm, setIsActiveForm] = useState(false);
    const [formData, setFormData] = useState<Product | null>(null);
    const [isActiveConfirmDelete, setIstActiveConfirmDelete] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [id, setId] = useState(0);
    
    
    
    const handleAddProduct = () => {
      setFormData(null);
      setIsActiveForm(!isActiveForm);
      console.log(isActiveForm);
    }
    
    const handleEditProduct = (product:Product) => {
      setFormData(product);
      setIsActiveForm(!isActiveForm);
    }
    
    const { mutate: deleteProduct, isPending:deleteIsLoading } = useDeleteProduct();
    const handleActiveConfirmDelete = (id:number) => {
      setId(id);
      setIstActiveConfirmDelete(!isActiveConfirmDelete); 
    }
    
      if(isConfirmDelete){
      console.log('Delete');
      deleteProduct(id);
      setIsConfirmDelete(false);
    }
    // if (productsIsLoading) {
    //   console.log('Loading...');
    // }else{
    //   console.log(items.data);
    //   console.log(`${baseUrl}storage/products/${items.data[4].image}`);
    // }

    

    
    return (
      <div className="container">
        <h1 className="text-center mt-3">Our Products</h1>
        
        {
          isActiveForm && (
          <FormProduct 
            isActiveForm={isActiveForm} 
            setIsActiveForm={setIsActiveForm} 
            formData={formData} 
            mode={formData && Object.keys(formData).length > 0 ? 'edit' : 'create'}
            />
          )
        }

        {
          isActiveConfirmDelete ? <ConfirmationAlert 
          isConfirm={isActiveConfirmDelete} 
          setIsConfirm={setIstActiveConfirmDelete} 
          isConfirmDelete={isConfirmDelete} 
          setIsConfirmDelete={setIsConfirmDelete} /> : null
        }

        <button className="btn btn-success mb-2 btn-add-product " onClick={handleAddProduct}>Add Product</button>
        <table className="table table-responsive">
          <thead>
            <tr className="table-success">
              <th scope="col">No</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Description</th>
              <th scope="col">Picture</th>
              <th scope="col" className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {              productsError ? ( <tr>
              <td colSpan={6} className="text-center">
                {productsError.message}
                </td></tr> ) : null
            }
            {productsIsLoading ? ( <tr>
              <td>
                Loading...
                </td></tr> ) : items?.data?.map((product, index) => ( 
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.product_name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.description}</td>
                <td><img src={`${baseUrl}/storage/products/${product.image}`} alt="picture product" className="img-products-list" /></td>
                <td>
                  <div className="d-flex">
                    <button className="btn btn-warning me-1 me-md-2 action-products-list" onClick={()=>handleEditProduct(product)}> <i className="bi bi-pencil"></i> </button>
                    <button className="btn btn-danger action-products-list" onClick={()=>handleActiveConfirmDelete(product.id)}> <i className="bi bi-trash"></i> </button>
                  </div>
                </td>
              </tr>
            ))
          }  
          {deleteIsLoading ? ( <tr>
              <td colSpan={6} className="text-center">
                Deleting...
                </td></tr> ) : null
            }
          </tbody>
        </table>
        {lastPage === 1 ? null : (<nav aria-label="Product pagination">
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
        </nav>)}
      </div>
    );
  }
  export default ProductPage