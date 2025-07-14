import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav>
      <div className="logo-container">
        <Link to="/">
          <img src="/logo3.png" alt="404: Pet Not Found Logo" className="nav-logo" />
        </Link>
      </div>
      <ul>
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
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
