import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import OprationalPage from "./pages/OprationalPage"
import ProductPage from "./pages/ProductPage"
import HppPage from "./pages/HppPage"
import CashierPage from "./pages/CashierPage"
import TransactionPage from "./pages/TransactionsPage"
import "./App.css";

function App() {

  return (
    <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/cashier" element={<CashierPage/>}></Route>
        <Route path="/products" element={<ProductPage/>}></Route>
        <Route path="/oprational" element={<OprationalPage/>}></Route>
        <Route path="/hpp" element={<HppPage/>}></Route>
        <Route path="/transactions" element={<TransactionPage/>}></Route>
        
      </Routes>
    </>
  )
}

export default App
