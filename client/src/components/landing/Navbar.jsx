import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        SecureSentinel
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/">Features</a>
        <a href="/">Security</a>
        <a href="/">Docs</a>
      </div>

      <Link to="/dashboard" className="dashboard-btn">
  Launch Dashboard
</Link>

    </nav>
  );
}

export default Navbar;