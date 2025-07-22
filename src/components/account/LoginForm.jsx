import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { jwtDecode } from "jwt-decode";
import "./AuthForm.css";

const BASE_URL = 'http://localhost:3000';

export default function LoginForm({ setToken }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const socket = useSocket();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);

        //Decodes token to get user ID and join their room
        const decoded = jwtDecode(data.token);
        if (socket && decoded?.id) {
          socket.emit("join_room", `user_${decoded.id}`);
          console.log(`Joined room: user_${decoded.id}`);
        }

        navigate('/');
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <div className="password-toggle-container">
      <input name="password"type={showPassword ? "text" : "password"} placeholder="Password"onChange={handleChange} required />
      <label> <input type="checkbox"checked={showPassword} onChange={() => setShowPassword(!showPassword)}/> Show Password</label></div>
      <button type="submit">Login</button>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}