import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../api/useMaterialLog";
import { useProductsCashier} from "../api/useProduct";
import { baseUrl } from "../api/baseUrl";
import NotificationAlert from "../components/NotificationAlert";
import { formatCurrency } from "../components/FormatCurrency";
import { unformatCurrency } from "../components/FormatCurrency";
import { useStoreTransaction, useTransactions } from "../api/useTransaction";
import { useReactToPrint } from "react-to-print";
import FormOnlineOrder from "../components/FormOnlineOrder";
import logo from "../../dist/Logo Cup Hijau.png";
import Chatbot from "../components/ChatBot";
import { useQueryClient } from "@tanstack/react-query";
import ChatRecipeBot from "../components/ChatRecipeBot";

const CashierPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(()=>{
    const handler = setTimeout(()=>{
      setDebouncedSearch(searchTerm);
      setPage(1); 
    },500)
    return () => clearTimeout(handler);
  },[searchTerm]);
  const {data: products, isLoading:productsIsLoading, error: productsError} = useProductsCashier(page,debouncedSearch);
  const {data: transactions = [] } = useTransactions();
      // console.log(products);
      // productsIsLoading ? console.log('Loading...') : console.log(products.data);
      const items = products?.data?.data??[];
      const currentPage = products?.data?.current_page ?? 1;
      const lastPage = products?.data?.last_page ?? 1;
  
      type Product = {
        id: number;
        product_name: string;
        qty: number;
        price: number;
      }

      const [transactionDate, setTransactionDate] = useState(new Date());
      const formatDate = (date:Date)=>{
        const year = date.getFullYear();
        const month = String(date.getMonth()+1).padStart(2,"0");
        const day = String(date.getDate()).padStart(2,"0");
        return `${year}-${month}-${day}`;
      }
      const formatDisplayDate = (date:Date)=>{
        const year = date.getFullYear();
        const month = String(date.getMonth()+1).padStart(2,"0");
        const day = String(date.getDate()).padStart(2,"0");
        return `${day}-${month}-${year}`;
      }
      const generateTransactionCode = ()=>{
        // const today = new Date();
        const dateDisplay = formatDisplayDate(transactionDate);

        const todayStr = formatDate(transactionDate);
        const todayTransactions = transactions.filter(
          (t)=>t.transaction_date?.startsWith(todayStr)
        );

        const nextNumber = todayTransactions.length + 1;

        console.log(todayStr);
        console.log(transactions);
        return `${String(nextNumber).padStart(3,"0")}-${dateDisplay}`;
      }


      const [customerName, setCustomerName] = useState('');
      const [productsList, setProductsList] = useState<Product[]>([]);
      const [bayar, setBayar] = useState<number>(null);
      const [kembalian, setKembalian] = useState(0);
      const [tax, setTax] = useState<number>(0);
      const [diskon, setDiskon] = useState<number>(0);
      const [subtotal,setSubtotal]=useState<number>(0);
      const [total, setTotal] = useState(0);
      const [loading, setLoading] = useState(false);
      
      const [isSuccess,setIsSuccess] = useState(false);
      const [isSave,setIsSave] = useState(false);
      const [isQris,setIsQris] = useState(false);

      const [isOfflineOrder, setIsOfflineOrder] = useState(false);
      const [isCash, setIsCash] = useState(false);
      const [isOnlineOrder, setIsOnlineOrder] = useState(false);
      const [orderMethod, setOrderMethod] = useState("");
      const [paymentMethod, setPaymentMethod] = useState("");
      const [errorTransaction, setErrorTransaction] = useState(null);
      const {data:dataDashboard, isLoading: loadingDashboard} = useDashboard();

      useEffect(() => {
        console.log("productsList Updated:", productsList);
        
      }, [productsList]);

      useEffect(() => {
        console.log("Kembalian Updated:", kembalian);
      }, [kembalian]);

      const transaction_code = generateTransactionCode();

      // const [transaction_code, setTransactionCode] = useState(`${Math.ceil(Math.random() * 1000)}-${new Date().toLocaleDateString("id-ID").split("/").join("-")}`); 

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
      
      
      const { mutateAsync: storeTransaction } = useStoreTransaction();
      const handleBayar = (total,bayar) =>{
        if(bayar < total) {
          alert("Uang tidak cukup");
          return false;
        } else {
          const kembalian = bayar - total;
          setKembalian(kembalian);
          setTotal(total);
          return true;
        }
      }

      const saveOrder = async (finalTotal?: number, newMethod?: string) => {

        if(productsList.length === 0){
          alert("Belum ada produk yang dipilih");
          return;
        }

        if(customerName === ''){
          alert("Nama customer harus diisi");
          return;
        }

        const totalFix = finalTotal ?? subtotal;

        if(paymentMethod === "Cash"){
          if(bayar === null || bayar === 0){
            alert("Masukkan jumlah bayar dulu");
            return;
          }

          if(bayar < totalFix){ // 🔥 FIX DI SINI
            alert("Uang tidak cukup");
            return;
          }
        }

        const items = productsList.map((product) => ({
          product_id: product.id,
          quantity: product.qty,
          price: product.price,
          subtotal: product.qty * product.price,
        }));

        const payload = {
          transaction_code: transaction_code,
          transaction_date: formatDate(transactionDate),
          customer_name: customerName,
          discount: diskon,
          total_price: totalFix,
          pay: isCash ? Number(bayar) : totalFix,
          change: isCash ? kembalian : 0,
          items,
          tax,
          order_method: newMethod ?? "Offline",
          payment_method: newMethod ?? paymentMethod
        };
        console.log("Payload", payload);
          try {
            const res = await storeTransaction(payload);

            if (!res.success) {
              setErrorTransaction(res);
              return;
            }

            queryClient.invalidateQueries({ queryKey: ["dashboard"] });

            handlePrintClick();

            setCustomerName("");
            setProductsList([]);
            setDiskon(0);
            setOrderMethod("");
            setPaymentMethod("");
            setBayar(null);
            setKembalian(null);
            setIsCash(false);
            setIsSave(true);
            if (loading) return;
            setLoading(true);

          } catch (err: any) {
            console.log("ERROR", err);

            setErrorTransaction(err.response?.data);
          }finally{
            setLoading(false);
          }
      };

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
    
    const filteredProducts = Array.isArray(items) ? (items ?? []).filter((p)=>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleOnlineForm = (order_method)=>{
      setIsOnlineOrder(!isOnlineOrder);
      setOrderMethod(order_method);
    } 


  return (
    <div className="container pt-3">
      <ChatRecipeBot/>
      { loadingDashboard ? (<p>Loading...</p>): 
      (<>
        <h5 className="fw-bold mb-3">⚠️ Low Stock</h5>

        {dataDashboard?.low_stock?.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2"
            style={{ color: "red", fontWeight: 500 }}
          >
            <span style={{ marginRight: 8 }}>⚠️</span>
            <span>
              {item.name} : {item.stock} {item.unit} 
            </span>
          </div>
        ))}
      </>)}
      {
        errorTransaction ? (
          <NotificationAlert 
          message={errorTransaction.message}
          subject="Stock Bahan Tidak Cukup"
          isSuccess={true}
          setIsSuccess={setIsSave}
          handleCloseForm={()=>setErrorTransaction(null)}
        >
        </NotificationAlert>
      ) : null
    }
      {isQris ? (<NotificationAlert
          message={`Total Harga = ${formatCurrency(subtotal)}`}
          isSuccess={isQris}
          setIsSuccess={setIsQris}
          subject="Pembayaran melalui QRIS"
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
                    ) : filteredProducts?.map((product, index)=>(
                      
                      <div className="product-card d-flex flex-column justify-content-between bg-light pt-0"  key={index} >
                          <div className="product-image mb-2 mb-md-3 bg-light">
                            <img src={`${baseUrl}/storage/products/${product.image}`} alt="picture product" className="img-product-cashier"/>
                          </div>
                          <div className="product-name ">{product.product_name}</div>
                          <div className="product-description">{product.description}</div>
                          <div className="product-price">{formatCurrency(product.price)}</div>
                          <div className="button-action d-flex justify-content-around px-1 px-md-3 pb-4">
                            <button className="btn btn-secondary btn-delete me-0" onClick={()=>handleLessProduct(product)}>
                                <span>-</span>
                            </button>
                            {
                              (()=>{
                                const item = productsList.find(p=> p.id===product.id);
                                return item ? (
                                  <input 
                                    type="number"
                                    className="form-control w-50 py-0"
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
                            <button className="add-btn ms-0" onClick={()=>handleAddProduct(product)}>
                                <span>+</span>
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
                        <label className="input-label">No. Pesanan</label>
                        <input type="text" className="input-field" id="orderNumber" value={transaction_code} readOnly/>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Nama Pelanggan</label>
                        <input type="text" className="input-field" name="nama" id="nama" value={customerName} onChange={(e) => setCustomerName(e.target.value)}  placeholder="Masukkan nama pelanggan"></input>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Tanggal</label>
                        <input type="date" className="input-field" id="orderDate" value={new Date(transactionDate).toLocaleDateString("en-CA")} onChange={(e)=>setTransactionDate(new Date(e.target.value))} />
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
                    <div className="methode-section">
                      <div className="summary-row fw-semibold fs-6" style={{color: "#2d5a3d"}}>
                        <span>Metode Pesanan</span>
                      </div>
                      <div className="order-method d-flex justify-content-evenly py-3 flex-wrap " >
                        <div className="w-100 d-flex">
                        <button className={`btn btn-warning btn-shopeefood flex-fill`}  onClick={()=>handleOnlineForm("ShopeeFood")}>ShopeeFood</button>
                        <button className="btn btn-primary btn-grabfood flex-fill" onClick={()=>handleOnlineForm("GrabFood")}>GrabFood</button>
                        <button className="btn btn-danger btn-gofood flex-fill" onClick={()=>handleOnlineForm("GoFood")}>GoFood</button>
                        </div>
                        <div className="w-100 mt-2 mt-md-3">
                        <button className={`btn btn-secondary w-100 ${isOfflineOrder ? " active" : ""}`} onClick={()=>setIsOfflineOrder(!isOfflineOrder)}>Offline Order</button>
                        </div>
                      </div>
                    </div>
                    <div className={`summary ${isOfflineOrder ? "" : "d-none"}`}>
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
                    <div className={`payment-section ${isOfflineOrder ? "" : "d-none"}`}>
                        <div className="payment-method d-flex w-100">
                          <button className="btn btn-success flex-fill" onClick={()=>{setIsCash(true);setPaymentMethod("Cash"); setBayar(null)}}>Cash</button>
                          <button className="btn btn-danger flex-fill" onClick={()=>{setPaymentMethod("QRIS"); setBayar(subtotal); setIsQris(true)}}>Qris</button>
                        </div>
                        <div className={`input-group ${isCash ? " " : "d-none"}`}>
                            <label className="input-label">Jumlah Bayar</label>
                            <input type="text" className="input-field" id="paymentAmount" placeholder="Rp. xxx.xxx" onChange={
                              (e)=> {
                                                          const cleanValue = unformatCurrency(e.target.value);
                                                          setBayar(Number(cleanValue))
                            } }
                            value={formatCurrency(bayar)} />
                        </div>
                        <div className={`summary-row ${isCash ? " " : "d-none"}`} style={{marginTop: "12px", fontWeight: "600", color: "#2d5a3d"}}>
                            <span>Kembalian:</span>
                            <span id="change">{formatCurrency(kembalian)}</span>
                        </div>
                    </div>
                    <div className={`action-buttons ${isOfflineOrder ? "" : "d-none"}`}>
                        <button className="primary-btn" onClick={()=>{
                              const finalTotal = subtotal + tax - diskon;
                              const isValid = handleBayar(finalTotal, bayar);
                              if(!isValid) return;
                              saveOrder(finalTotal);}} disabled={loading}>
                            {loading ? "Processing...":  "💳 Bayar Sekarang"}
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

              {/* Online Order Form */}
              {isOnlineOrder ? (
                <FormOnlineOrder isActiveForm={isOnlineOrder} setIsActiveForm={setIsOnlineOrder} total_price={subtotal} order_method={orderMethod} onSave={saveOrder}/>
              ) : null}

              {/* ====== STRUK CETAK (HIDDEN) ====== */}
<div style={{ display: "none" }}>
  <div ref={printRef} className="print-receipt">
    <div className="receipt-header mb-3">
      <h2 className="m-0"><img src={logo} alt="Logo Naninu Coffee" width={"10px"} /> NANINU COFFEE</h2>
      <p className="m-0">Jl. Mampang Prapatan 5, Jakarta Selatan</p>
      <p className="m-0">Telp: 0858-1730-1422</p>
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
      {paymentMethod === "QRIS" ? 
      <div className="summary-row m-0">
        <span>Metode Pembayaran</span>
        <span>{paymentMethod}</span>
      </div>
      :
      <div className="summary-row m-0">
        <span>Kembalian</span>
        <span>{formatCurrency(kembalian)}</span>
      </div>
      }
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