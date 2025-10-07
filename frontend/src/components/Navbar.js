import { Link } from 'react-router-dom';
const navStyle = {
  background: '#b39ddb',
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '2rem',
  display: 'flex',
  gap: '2rem'
};

const linkStyle = {
  color: '#512da8',
  textDecoration: 'none',
  fontWeight: 'bold'
};
<div style={{ background: "#f3e5f5", borderRadius: "1rem", padding: "2rem" }}>
  {/* Page content */}
</div>

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <Link style={linkStyle} to="/">Dashboard</Link>
      <Link style={linkStyle} to="/products">Products</Link>
      <Link style={linkStyle} to="/orders">Orders</Link>
      <Link style={linkStyle} to="/shipping">Shipping</Link>
    </nav>
  );
}
