import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import logoNav from "../assets/logo-nav.png";
const Navbar = () => {
  return (

    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container">
            <a className="navbar-brand p-0" href="#">
                <img src={logoNav} alt="" className="logo-nav"/> BEMBY COFFEE
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li>
                    <Link className="nav-item nav-link text-white" to="/">Home</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/cashier">Cashier</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/products">Products</Link>
                  </li>
                  {/* <li>
                    <Link className="nav-item nav-link text-white" to="/oprational">Oprational</Link>
                  </li> */}
                  <li>
                    <Link className="nav-item nav-link text-white" to="/hpp">Cost and Benefit</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/transactions">Transactions</Link>
                  </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}
export default Navbar;