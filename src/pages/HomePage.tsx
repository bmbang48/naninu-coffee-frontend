import { Link } from "react-router";
import logoWhite from "../assets/logo-nav.png"
import { useTransactions } from "../api/useTransaction";
import { formatCurrency } from "../components/FormatCurrency";
import Chatbot from "../components/ChatBot";
const HomePage = () => {




    // Transaction Today
    const {data:transactions} = useTransactions();
    // console.log(transactions)
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)
    const transactionToday = (transactions?? []).filter(
        (t)=> t.transaction_date === today
    );
    // console.log("TRANSACTION TODAY: ",transactionToday)

    // Income Today
    const totalIncomeToday = transactionToday.reduce(
        (total,trx) =>
            total + trx.items.reduce(
                (itemTotal, item) => itemTotal + Number(item.subtotal||0),
                0
            ),
        0
    );
    // console.log("TOTAL INCOME :",totalIncomeToday)

    // Top Product
    const itemsToday = transactionToday.flatMap(t => t.items);
    // console.log("ITEMS TODAY : ", itemsToday)
    
    const productCount = itemsToday.reduce((acc,item)=>{
        const name = item.product.product_name;

        acc[name] = (acc[name]||0) + item.quantity;
        return acc;
    },{});
    // console.log("PRODUCT COUNT : ", productCount);

    const topProduct = Object.entries(productCount).reduce(
        (max,current)=> {
            return current[1] > max[1] ? current : max; 
        },
        ["-",0]
    );
    // console.log("TOP PRODUCT :", topProduct)

    const topProductName = Number(topProduct[1]) > 0 ? topProduct[0] : "Belum ada transaksi";





  return (
    <div>
        <Chatbot/>
      {/* <!-- Hero Section --> */}
    <section className="hero-section">
        <div className="container">
            <div className="row justify-content-center text-center">
                <div className="col-lg-8 align-items-center justify-content-center">
                    <img src={logoWhite} alt=""  className="logo-naninu-utama"/>
                    <h1 className="hero-title mt-0">Welcome to NANINU COFFEE Dashboard</h1>
                    <p className="hero-subtitle">Manage your café operations easily — from materials to transactions.</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Quick Access Cards --> */}
    <section className="py-5">
        <div className="container">
            <h2 className="section-title">Quick Access</h2>
            <div className="row g-4 justify-content-center">
                <div className="col-lg-4 col-md-6">
                    <div className="card quick-access-card shadow-sm rounded-3 p-4">
                        <div className="card-body text-center">
                            <div className="card-icon mx-auto">
                                <i className="bi bi-cart-check"></i>
                            </div>
                            <h5 className="card-title fw-semibold mb-3">Cashier</h5>
                            <p className="card-text text-muted mb-4">Process orders and handle customer transactions efficiently.</p>
                            <Link to="/cashier" className="btn btn-primary-custom">Go to page</Link>
                            
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6">
                    <div className="card quick-access-card shadow-sm rounded-3 p-4">
                        <div className="card-body text-center">
                            <div className="card-icon mx-auto">
                                <i className="bi bi-box-seam"></i>
                            </div>
                            <h5 className="card-title fw-semibold mb-3">Production</h5>
                            <p className="card-text text-muted mb-4">Manage your coffee menu, pricing, and inventory items.</p>
                            <Link to="/production" className="btn btn-primary-custom">Go to page</Link>
                        </div>
                    </div>
                </div>
                
                {/* <div className="col-lg-4 col-md-6">
                    <div className="card quick-access-card shadow-sm rounded-3 p-4">
                        <div className="card-body text-center">
                            <div className="card-icon mx-auto">
                                <i className="bi bi-gear"></i>
                            </div>
                            <h5 className="card-title fw-semibold mb-3">Operational</h5>
                            <p className="card-text text-muted mb-4">Monitor daily operations and staff management tools.</p>
                            <Link to="/oprational" className="btn btn-primary-custom">Go to page</Link>
                        </div>
                    </div>
                </div> */}
                
                <div className="col-lg-4 col-md-6">
                    <div className="card quick-access-card shadow-sm rounded-3 p-4">
                        <div className="card-body text-center">
                            <div className="card-icon mx-auto">
                                <i className="bi bi-receipt"></i>
                            </div>
                            <h5 className="card-title fw-semibold mb-3">Transactions</h5>
                            <p className="card-text text-muted mb-4">View transaction history and payment records.</p>
                            <Link to="/transactions" className="btn btn-primary-custom">Go to page</Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card quick-access-card shadow-sm rounded-3 p-4">
                        <div className="card-body text-center">
                            <div className="card-icon mx-auto">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <h5 className="card-title fw-semibold mb-3">Operational</h5>
                            <p className="card-text text-muted mb-4">Analyze profits, expenses, and financial performance.</p>
                            <Link to="/operational" className="btn btn-primary-custom">Go to page</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Stats Overview --> */}
    <section className="py-5 bg-light">
        <div className="container">
            <h2 className="section-title">Today's Overview</h2>
            <div className="row g-4">
                <div className="col-lg-4 col-sm-12">
                    <div className="stats-card">
                        <div className="stats-number">{formatCurrency(totalIncomeToday)}</div>
                        <div className="stats-label">Daily Income</div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-sm-12">
                    <div className="stats-card">
                        <div className="stats-number">{transactionToday.length}</div>
                        <div className="stats-label">Total Transactions</div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-sm-12">
                    <div className="stats-card">
                        <div className="stats-number fs-4">{topProductName}</div>
                        <div className="stats-label">Top Product</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Footer --> */}
    <footer className="footer-custom">
        <div className="container">
            <div className="row">
                <div className="col-12 text-center">
                    <p className="text-muted small mb-0">© 2025 NANINU COFFEE | Crafted with ❤️ for better café operations</p>
                </div>
            </div>
        </div>
    </footer>
    </div>
  );
}
export default HomePage;