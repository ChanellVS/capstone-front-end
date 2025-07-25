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
    <nav className="navbar-container" aria-label="Main Navigation">
      {/* Logo */}
      <div className="logo-container">
        <Link to="/" aria-label="Go to homepage">
          <img
            src="/Untitled (4).png"
            alt="404: Pet Not Found Logo"
            className="nav-logo"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/" aria-label="Go to Home">Home</Link>
        </li>
        <li>
          <Link to="/posts" aria-label="View all pet listings">View Listings</Link>
        </li>
        <li>
          <Link to="/postPet" aria-label="Post a new pet">Post a Pet</Link>
        </li>

        {!token ? (
          <>
            <li>
              <Link to="/login" aria-label="Login page">Login</Link>
            </li>
            <li>
              <Link to="/register" aria-label="Register page">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile" aria-label="My profile page">My Profile</Link>
            </li>
            <li>
              <Link to="/inbox" aria-label="Inbox messages">Messages</Link>
            </li>
            <li>
              <button
                className="nav-button"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;