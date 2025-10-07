import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{marginBottom:20}}>
      <Link to="/">Products</Link> | <Link to="/orders" style={{marginLeft:8}}>Orders</Link> | <Link to="/shipping" style={{marginLeft:8}}>Shipping</Link>
    </nav>
  );
}
