import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div>
      <h1>Welcome to 404PetNotFound</h1>
      <p>Find and report lost or found pets in your community.</p>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}
