import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import logoNav from "../assets/logo-nav.png";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { logoutUser } from "../api/useLogin";
import { useMsal } from "@azure/msal-react";

const Navbar = () => {
  const { instance } = useMsal();
  const [user, setUser] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");

      // 🔥 kalau belum ada token → jangan fetch
      if (!token) return;

      // 🔥 ambil dari localStorage dulu
      const localUser = localStorage.getItem("user");
      if (localUser) {
          setUser(JSON.parse(localUser));
      }

      // 🔥 baru fetch ke API (optional)
      const getUser = async () => {
          const data = await fetchWithAuth("/me");
          if (data) setUser(data);
      };

      if (token !== "SSO_LOGIN") {
          getUser();
      }
  }, []);
    console.log(user);

    
    const handleLogout = async () => {
    const token = localStorage.getItem("token");
      try {
          // 🔥 kalau login biasa (Laravel)
          if(token !== "SSO_LOGIN"){
              await logoutUser();
          }

          // 🔥 kalau login Microsoft
          if(token === "SSO_LOGIN"){
              await instance.logoutPopup({
                  postLogoutRedirectUri: "/login"
              });
          }

      } catch (error) {
          console.error("Logout error:", error);
      } finally {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setTimeout(()=>{
            navigate("/login", { replace: true });
          },100);
      }
  };
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container ">
            <a className="navbar-brand p-0" href="/">
                <img src={logoNav} alt="" className="logo-nav"/> NANINU COFFEE
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="d-flex flex-column justify-content-end align-items-end">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li>
                    <Link className="nav-item nav-link text-white" to="/">Home</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/cashier">Cashier</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/production">Production</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/operational">Operational</Link>
                  </li>
                  <li>
                    <Link className="nav-item nav-link text-white" to="/transactions">Transactions</Link>
                  </li>
                  {user && 
                  <li>
                    <Link className="nav-item nav-link text-white" to="" onClick={handleLogout}>Logout</Link>
                  </li>
                  }
                </ul>
            </div>
            </div>
        </div>
    </nav>
            {user && 
            <p className="text-white text-end w-100 pe-md-5 pe-2 position-absolute z-3">
                Welcome, {user.name}
            </p> 
            }
  </>);
}
export default Navbar;