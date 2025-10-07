import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    axios.get(`${API_BASE}/products/`).then(r => setProducts(r.data)).catch(console.error);
  }

  function addProduct() {
    axios.post(`${API_BASE}/products/`, { name, price: parseInt(price), stock: parseInt(stock) })
      .then(r => {
        setName(""); setPrice(""); setStock("");
        fetchProducts();
      })
      .catch(e => alert(e.response?.data?.detail || e.message));
  }

  return (
    <div>
      <h2>Products</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Price (cents)" value={price} onChange={e=>setPrice(e.target.value)} style={{marginLeft:8}} />
        <input placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} style={{marginLeft:8}} />
        <button onClick={addProduct} style={{marginLeft:8}}>Add</button>
      </div>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Price (cents)</th><th>Stock</th></tr></thead>
        <tbody>
          {products.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.price}</td><td>{p.stock}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
