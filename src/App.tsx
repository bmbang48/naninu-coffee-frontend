import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import CashierPage from "./pages/CashierPage"
import TransactionPage from "./pages/TransactionsPage"
import "./App.css";
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import MaterialLogPage from "./pages/MaterialLogPage";
import ProductionPage from "./pages/ProductionPage"
function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage/>}></Route>
        {/* Protected */}
        <Route path="/*" element={
          <ProtectedRoute>
            <>
              <Navbar></Navbar>
              <Routes>
                <Route path="/" element={<HomePage/>}></Route>
                <Route path="/cashier" element={<CashierPage/>}></Route>
                <Route path="/transactions" element={<TransactionPage/>}></Route>
                <Route path="/operational" element={<MaterialLogPage />} />
                <Route path="/production" element={<ProductionPage/>}/>
              </Routes>
            </>
          </ProtectedRoute>
        }></Route>
        
      </Routes>
    </>
  )
}

export default App
