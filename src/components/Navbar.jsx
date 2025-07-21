import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <Link to="/">
          <img src="/Untitled (4).png" alt="404: Pet Not Found Logo" className="nav-logo" />
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/posts">View Listings</Link></li> 
        <li><Link to="/postPet">Post a Pet</Link></li>

        {!token ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/inbox">Messages</Link></li>
            <li><button className="nav-button" onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;