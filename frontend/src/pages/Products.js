import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";

const pageStyle = {
  background: "#f3e5f5",
  borderRadius: "1rem",
  padding: "2rem"
};
const cardStyle = {
  background: "#e1bee7",
  padding: "1rem",
  borderRadius: "0.5rem",
  marginBottom: "2rem",
  boxShadow: "0 2px 8px rgba(119, 77, 166, 0.08)"
};


export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [restock, setRestock] = useState({}); // productId -> new stock value

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    axios.get(`${API_BASE}/products/`)
      .then(r => setProducts(r.data))
      .catch(console.error);
  }

  function addProduct() {
    axios.post(`${API_BASE}/products/`, { name, price: parseInt(price), stock: parseInt(stock) })
      .then(() => {
        setName("");
        setPrice("");
        setStock("");
        fetchProducts();
      })
      .catch(e => alert(e.response?.data?.detail || e.message));
  }

  // Restock handler
  function restockProduct(productId, amount) {
    if (!amount || isNaN(amount) || amount < 1) {
      alert("Enter a valid stock amount.");
      return;
    }
    axios.put(`${API_BASE}/products/${productId}/restock?stock=${amount}`)
      .then(() => {
        setRestock({ ...restock, [productId]: "" });
        fetchProducts();
      })
      .catch(e => alert(e.response?.data?.detail || e.message));
  }

  return (
    <div>
      <h2>Products</h2>
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Price (cents)" value={price} onChange={e => setPrice(e.target.value)} style={{ marginLeft: 20 }} />
        <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={addProduct} style={{ marginLeft: 8 }}>Add</button>
      </div>
      <table border={1} cellPadding={6} cellSpacing={0} style={{ width: "70%", maxwidth: "800px",fontsize: "1.2rem"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price (cents)</th>
            <th>Stock</th>
            <th>Restock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <input
                  style={{ width: 60 }}
                  type="number"
                  min="1"
                  placeholder="New stock"
                  value={restock[p.id] || ""}
                  onChange={e => setRestock({ ...restock, [p.id]: e.target.value })}
                />
                <button
                  onClick={() => restockProduct(p.id, restock[p.id])}
                  disabled={!restock[p.id]}
                  style={{ marginLeft: 4 }}
                >
                  Restock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
