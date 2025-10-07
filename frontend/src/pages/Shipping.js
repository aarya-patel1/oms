import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config";

export default function Shipping(){
  const [orderId, setOrderId] = useState("");
  const [msg, setMsg] = useState("");

  function shipOrder(){
    axios.put(`${API_BASE}/orders/${orderId}/ship`).then(r=>{
      setMsg(`Order ${r.data.id} marked as shipped.`);
    }).catch(e=>{
      setMsg(e.response?.data?.detail || e.message);
    });
  }

  return (
    <div>
      <h2>Shipping (mark shipped)</h2>
      <input placeholder="Order ID" value={orderId} onChange={e=>setOrderId(e.target.value)} />
      <button onClick={shipOrder} style={{marginLeft:8}}>Ship</button>
      <p>{msg}</p>
    </div>
  );
}
