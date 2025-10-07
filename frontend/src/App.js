import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Shipping from "./pages/Shipping";

export default function App() {
  return (
    <Router>
      <div style={{padding:20, fontFamily:'Arial, sans-serif'}}>
        <h1>Order Management</h1>
        <Navbar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/shipping" element={<Shipping />} />
        </Routes>
      </div>
    </Router>
  );
}
