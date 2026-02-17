import { useEffect, useState, useRef } from "react";
import { useProductsCashier} from "../api/useProduct";
import { baseUrl } from "../api/baseUrl";
import NotificationAlert from "../components/NotificationAlert";
import { formatCurrency } from "../components/FormatCurrency";
import { unformatCurrency } from "../components/FormatCurrency";
import { useStoreTransaction } from "../api/useTransaction";
import { useReactToPrint } from "react-to-print";

const CashierPage = () => {
  const [page, setPage] = useState(1)
  const {data: products, isLoading:productsIsLoading, error: productsError} = useProductsCashier(page);
      // console.log(products);
      // productsIsLoading ? console.log('Loading...') : console.log(products.data);
      const items = products?.data??[];
      console.log('ini Items', items);
      const currentPage = products?.current_page ?? 1;
      const lastPage = products?.last_page ?? 1;
  
      type Product = {
        id: number;
        product_name: string;
        qty: number;
        price: number;
      }

      const [customerName, setCustomerName] = useState('');
      const [productsList, setProductsList] = useState<Product[]>([]);
      const [bayar, setBayar] = useState<number>(null);
      const [kembalian, setKembalian] = useState(0);
      const [tax, setTax] = useState<number>(0);
      const [diskon, setDiskon] = useState<number>(0);
      const [subtotal,setSubtotal]=useState<number>(0);
      const [total, setTotal] = useState(0);
      
      const [isSuccess,setIsSuccess] = useState(false);
      const [isSave,setIsSave] = useState(false);

      const [searchTerm, setSearchTerm] = useState("");
      useEffect(() => {
        console.log("productsList Updated:", productsList);
        
      }, [productsList]);

      useEffect(() => {
        console.log("Kembalian Updated:", kembalian);
      }, [kembalian]);

      const [transaction_code, setTransactionCode] = useState(`${Math.ceil(Math.random() * 1000)}-${new Date().toLocaleDateString("id-ID").split("/").join("-")}`); 

      // const [qty, setQty] = useState(0);

  useEffect(()=> {
    const subtotal = productsList.reduce(
      (sum,p) => sum + p.price*p.qty,
      0
    );
    setTax(0);

    // const taxAmount = subtotal * 0.10;
    // setDiskon(taxAmount)
    // setTax(taxAmount)
    setSubtotal(subtotal)
}, [productsList])
  const handleAddProduct = (product: Product) => {

        const existingProduct = productsList.find((p)=> p.id === product.id);

        if(existingProduct) {
          const updatedList = productsList.map((p)=>
          p.id === product.id ? {...p, qty: p.qty +1} : p);
          setProductsList(updatedList);
        }else{
          setProductsList([...productsList, {...product, qty:1}])
        }
        

        
      }
    const handleLessProduct = (product: Product) => {

        const existingProduct = productsList.find((p)=> p.id === product.id);

        if(!existingProduct) return;

        if(existingProduct.qty <= 1){
          const filteredList = productsList.filter((p)=> p.id !== product.id);
          setProductsList(filteredList);
        }else{

          const updatedList = productsList.map((p)=>
            p.id === product.id ? {...p, qty: p.qty - 1} :p
          );
          setProductsList(updatedList);
        }

        
      }
      
      
      const { mutate: storeTransaction } = useStoreTransaction();
      const handleBayar = (total,bayar) =>{
        if(bayar < total) {
          alert("Uang tidak cukup");
        } else {
          const kembalian = bayar - total;
          setKembalian(kembalian);
          setTotal(total);
          // setIsSuccess(!isSuccess);
          handlePrintClick();
        }
      }

      const saveOrder = () => {
        if(productsList.length === 0){
          alert("Belum ada produk yang dipilih");
          return;
        }
        if(customerName === ''){
          alert("Nama customer harus diisi");
          return;
        }
        if(bayar < total){
          alert("Uang tidak cukup");
          return;
        }

        const items = productsList.map((product) => ({
          product_id: product.id,
          quantity: product.qty,
          price: product.price,
          subtotal: product.qty * product.price,
        }));
        const payload = {
            transaction_code : transaction_code,
            transaction_date : new Date().toISOString().split('T')[0],
            customer_name : customerName,
            discount: diskon,
            total_price : total,
            pay : Number(bayar),
            change : kembalian, 
            items : items,
            tax : tax,
          };
      storeTransaction(payload, {
        onSuccess: (data) => {
          console.log("Transaction saved successfully:", data);
          setCustomerName("");
          setTransactionCode(`${Math.ceil(Math.random() * 1000)}-${new Date().toLocaleDateString("id-ID").split("/").join("-")}`);
          setSubtotal(0);
          setProductsList([]);
          setDiskon(0);
          setBayar(0);
          setKembalian(0);
          setIsSave(!isSave);
        },
        onError: (err) => {
          console.error("Error saving transaction:" , err);
      } 
    }
      );
    }

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrintClick = ()=> {
      console.log("Ref untuk print", printRef.current)
      if(!printRef.current){
        alert("Struk belum siap cetak");
        return;
      }
      handlePrint();
    }

    const handlePrint = useReactToPrint({
      contentRef: printRef,
      documentTitle: `Struk-${transaction_code}`,
    })

    const filteredList = productsList.filter(product => product.qty > 0);
    
    const filteredProducts = (items ?? []).filter((p)=>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div className="container">
      {isSuccess ? (<NotificationAlert
          message="Pembayaran Berhasil Dilakukan"
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          subject="Pembayaran Berhasil"
          handleCloseForm={()=>setIsSuccess(false)}
          />) : null}
      {isSave ? (<NotificationAlert
          message="Transaksi Berhasil Disimpan"
          isSuccess={isSave}
          setIsSuccess={setIsSave}
          subject="Transaksi Berhasil Disimpan"
          handleCloseForm={()=>setIsSuccess(false)}
        />) : null}
        <div className="row d-flex flex-column flex-column-reverse flex-md-row">
            <div className="col-md-7 col-sm-12 mt-3 h-75 ">
                <div className="products-section h-75  row">
                  <div className="header-products-section d-flex justify-content-between">
                    <h2 className="section-title d-block mt-2 mt-md-0">☕ Menu Produk</h2>
                    <form className="d-block" role="search">
                      <input className="form-control me-1 ms-2 me-md-2" type="search" placeholder="Search" aria-label="Search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                    </form>
                  </div>
                  <div className="products-grid">
                  { productsError ? (
                    <p>{productsError.message}</p>
                  ) : null}
                  {
                    productsIsLoading ? (
                      <p>Loading...</p>
                    ) : filteredProducts.map((product, index)=>(
                      
                      <div className="product-card d-flex flex-column justify-content-between bg-light"  key={index} >
                          <div className="product-image mb-2 mb-md-3 bg-light">
                            <img src={`${baseUrl}/storage/products/${product.image}`} alt="picture product" className="img-product-cashier"/>
                          </div>
                          <div className="product-name ">{product.product_name}</div>
                          <div className="product-description">{product.description}</div>
                          <div className="product-price">{formatCurrency(product.price)}</div>
                          <div className="button-action d-flex justify-content-between">
                          <button className="add-btn" onClick={()=>handleAddProduct(product)}>
                              <span>+</span>
                          </button>
                          

                          {
                            (()=>{
                              const item = productsList.find(p=> p.id===product.id);
                              return item ? (
                                <input 
                                  type="number"
                                  className="form-control"
                                  value={item.qty}
                                  onChange={(e)=>{
                                    const updated = productsList.map(p =>
                                      p.id === product.id ? {...p, qty: Number(e.target.value)} : p
                                    );
                                    setProductsList(updated);
                                  }} />
                              ):null;
                            })()
                          }
                          <button className="btn btn-secondary btn-delete" onClick={()=>handleLessProduct(product)}>
                              <span>-</span>
                          </button>
                          </div>
                      </div>
                    ))
                    }
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-3">
                {lastPage === 1 ? null : <nav aria-label="Product pagination">
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
                </nav>}
            </div>
                </div>
            </div>
            <div className="col-md-5 col-sm-12 mt-3">
              <div className="transaction-section">
                <h2 className="section-title mb-3 mb-md-">🧾 Detail Transaksi</h2>            
                <div className="customer-info" >
                    <div className="input-group">
                        <label className="input-label">Nama Pelanggan</label>
                        <input type="text" className="input-field" name="nama" id="nama" value={customerName} onChange={(e) => setCustomerName(e.target.value)}  placeholder="Masukkan nama pelanggan"></input>
                    </div>
                    <div className="input-group">
                        <label className="input-label">No. Pesanan</label>
                        <input type="text" className="input-field" id="orderNumber" value={transaction_code} readOnly/>
                    </div>
                </div>

                <div className="order-list">
                    <h3 style={{fontSize: "16px", fontWeight: "600", color: "#374151"}}>Daftar Pesanan</h3>
                    <div className="order-items-container">
                        <div id="cartItems">
                            {
                              productsList.length > 0 ? (
                                  <table className="table cashier">
                                    <thead>
                                      <tr>
                                        <th className="text-center">No</th>
                                        <th>Nama Produk</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-center">Harga</th>
                                        <th className="text-center">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                {filteredList.map((product,index)=>(
                                    <tr key={index}>
                                      <td className="text-center">{index + 1}</td>
                                      <td>{product.product_name}</td>
                                      <td className="text-center">{product.qty}</td>
                                      <td className="text-end">{formatCurrency(product.price)}</td>
                                      <td className="text-end">{formatCurrency(product.qty * product.price)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                              ) : (

                                <div className="empty-cart">
                                Belum ada item yang dipilih
                            </div>
                            )
                          }
                        </div>
                    </div>
                </div>

                <div style={{flexShrink: 0}}>
                    <div className="summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span id="subtotal">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Diskon (belum berlaku):</span>
                            <span id="discount">
                              {/* <input type="number" className="form-control text-end" name="diskon" id="diskon" value={diskon} onChange={(event) => setDiskon(Number(event?.target.value))} disabled /> */}
                            </span>
                        </div>
                        <div className="summary-row">
                            <span>Pajak 10% (belum berlaku):</span>
                            <span id="tax">{formatCurrency(tax)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span id="total">{formatCurrency(subtotal+tax-diskon)}</span>
                        </div>
                    </div>

                    <div className="payment-section">
                        <div className="input-group">
                            <label className="input-label">Jumlah Bayar</label>
                            <input type="text" className="input-field" id="paymentAmount" placeholder="Rp. xxx.xxx" onChange={
                              (e)=> {
                                                          const cleanValue = unformatCurrency(e.target.value);
                                                          setBayar(Number(cleanValue))
                            } }
                            value={formatCurrency(bayar)} />
                        </div>
                        <div className="summary-row" style={{marginTop: "12px", fontWeight: "600", color: "#2d5a3d"}}>
                            <span>Kembalian:</span>
                            <span id="change">{formatCurrency(kembalian)}</span>
                        </div>
                    </div>
                
                    <div className="action-buttons">
                        <button className="primary-btn" onClick={()=>{
                              handleBayar(subtotal+tax-diskon, bayar);
                              saveOrder()}}>
                            💳 Bayar Sekarang
                        </button>
                        {/* <button className="secondary-btn" onClick={handlePrintClick}>
                            🖨️ Cetak Struk
                        </button>
                        <button className="secondary-btn" onClick={()=>saveOrder()}>
                            💾 Simpan Pesanan
                        </button> */}
                    </div>
                </div>
              </div>
              {/* ====== STRUK CETAK (HIDDEN) ====== */}
<div style={{ display: "none" }}>
  <div ref={printRef} className="print-receipt">
    <div className="receipt-header mb-3">
      <h2 className="m-0">☕ NANINU COFFEE</h2>
      <p className="m-0">Jl. Kopi No. 12, Jakarta</p>
      <p className="m-0">Telp: 0812-3456-7890</p>
      <hr />
    </div>

    <div className="receipt-info text-start mb-3">
      <p className="m-0">No. Pesanan: {transaction_code}</p>
      <p className="m-0">Pelanggan: {customerName || "-"}</p>
      <p className="m-0">{new Date().toLocaleString()}</p>
      <hr />
    </div>

    <div className="receipt-items">
      {productsList.map((p, i) => (
        <div key={i} className="receipt-item">
          <div className="text-start">{p.product_name}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="m-0">{p.qty} x {formatCurrency(p.price)}</span>
            <span className="m-0">{formatCurrency(p.qty * p.price)}</span>
          </div>
        </div>
      ))}
      <hr />
    </div>

    <div className="receipt-summary">
      <div className="summary-row m-0">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="summary-row m-0">
        <span>Pajak 10%</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>{formatCurrency(subtotal + tax - diskon)}</span>
      </div>
      <div className="summary-row m-0">
        <span>Bayar</span>
        <span>{formatCurrency(bayar)}</span>
      </div>
      <div className="summary-row m-0">
        <span>Kembalian</span>
        <span>{formatCurrency(kembalian)}</span>
      </div>
    </div>

    <div className="receipt-footer">
      <hr />
      <p className="m-0">Terima kasih atas kunjungan Anda!</p>
      <p className="m-0">Barang yang sudah dibeli tidak dapat dikembalikan.</p>
    </div>
  </div>
</div>

                
            </div>
        </div>
      
    </div>
  );
}

export default CashierPage;