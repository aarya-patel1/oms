import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    axios.get(`${API_BASE}/orders/`).then(r => setOrders(r.data)).catch(console.error);
  }

  function placeOrder() {
    axios.post(`${API_BASE}/orders/`, { product_id: parseInt(productId), quantity: parseInt(quantity) })
      .then(r => {
        setProductId(""); setQuantity("");
        fetchOrders();
        alert("Order placed (id: " + r.data.id + ")");
      })
      .catch(e => alert(e.response?.data?.detail || e.message));
  }

  return (
    <div>
      <h2>Orders</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Product ID" value={productId} onChange={e=>setProductId(e.target.value)} />
        <input placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)} style={{marginLeft:8}} />
        <button onClick={placeOrder} style={{marginLeft:8}}>Place Order</button>
      </div>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Product ID</th><th>Qty</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map(o => <tr key={o.id}><td>{o.id}</td><td>{o.product_id}</td><td>{o.quantity}</td><td>{o.status}</td><td>{o.total_price}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
