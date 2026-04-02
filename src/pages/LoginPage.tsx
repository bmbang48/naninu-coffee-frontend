import { useState,useEffect } from "react";
import { loginUser } from "../api/useLogin";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authconfig";    

const LoginPage = ()=>{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { instance } = useMsal();
    
    const handleMicrosoftLogin = async()=>{
    const response = await instance.loginPopup(loginRequest);

    const user = response.account;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "SSO_LOGIN");

    navigate("/", { replace: true });
}

    const handleLogin = async (e:React.FormEvent)=>{
        e.preventDefault(); 
        setLoading(true);
        setError("");

        try{
            const data = await loginUser(email,password);

            //Save Token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log(localStorage);
            navigate("/", {replace:true});  
            
        } catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }
    const { accounts } = useMsal();
    console.log(accounts);
    // useEffect(() => {
    //     if (accounts.length > 0) {
    //         const user = accounts[0];

    //         localStorage.setItem("user", JSON.stringify(user));
    //         localStorage.setItem("token", "SSO_LOGIN");
    //         console.log("redirect ke dasboard");
    //         navigate("/", { replace: true });
    //     }
    // }, [accounts]);
    return(
        <>
        <div className="login-wrapper">
            <div className="login-card">
                <div className="text-center">
                <div className="coffee-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M20 30 L22 60 C22 65 28 70 40 70 C52 70 58 65 58 60 L60 30 Z" fill="#0e9080" /> <path d="M25 35 L26 55 C26 58 30 62 38 62" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round" fill="none" /> <path d="M60 35 Q72 35 72 47 Q72 55 62 55" stroke="#0e9080" stroke-width="6" stroke-linecap="round" fill="none" /> <ellipse cx="40" cy="72" rx="25" ry="5" fill="#0a7566" />
                </svg>
                </div>
                <h1 className="brand-title">NANINU COFFEE</h1>
                <p className="brand-subtitle">Cashier Management System</p>
                </div>
                <form onSubmit={handleLogin}>
                <div className="form-group"><label className="form-label">Email</label>
                <div className="input-group">
                <svg width="20" height="20" className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" /> <path d="M22 6L12 13L2 6" />
                </svg><input type="email" className="form-control" placeholder="Masukkan email anda" onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                </div>
                <div className="form-group"><label className="form-label">Password</label>
                <div className="input-group">
                <svg width="20" height="20" className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0110 0v4" /> <circle cx="12" cy="16" r="1" />
                </svg><input type="password" className="form-control" placeholder="Masukkan password" onChange={(e)=>setPassword(e.target.value)} required/>
                </div>
                </div>
                {/* <div className="d-flex justify-content-between align-items-center mb-1" ><label className="checkbox-wrapper"> <input type="checkbox"/> <span>Ingat saya</span> </label> <a href="#" className="forgot-link">Lupa Password?</a> */}
                {/* </div> */}
                <button type="submit" className="btn-login">Masuk</button>
                <button className="btn btn-primary w-100 py-3 rounded-4 mt-3" onClick={handleMicrosoftLogin}>Masuk dengan Microsoft</button>
                </form>
                <div className="divider">
                © 2025 Naninu Coffee
                </div>
            </div>
        </div>
        </>
    );
}

export default LoginPage;