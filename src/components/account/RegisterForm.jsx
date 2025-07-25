import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const BASE_URL = 'http://localhost:3000'; // I will Change to Render URL when deploying

export default function RegisterForm({ setToken }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', location: '', phone_number: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setSuccess('Registration successful!');
        navigate('/profile');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <label htmlFor="reg-username">Username</label>
      <input
        id="reg-username"
        name="username"
        placeholder="Username"
        autoComplete="username"
        onChange={handleChange}
        required
      />

      <label htmlFor="reg-email">Email</label>
      <input
        id="reg-email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        onChange={handleChange}
        required
      />

      <label htmlFor="reg-password">Password</label>
      <input
        id="reg-password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="new-password"
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        /> Show Password
      </label>

      <label htmlFor="reg-location">Location</label>
      <input
        id="reg-location"
        name="location"
        placeholder="Location"
        autoComplete="address-level2"
        onChange={handleChange}
      />

      <label htmlFor="reg-phone">Phone Number</label>
      <input
        id="reg-phone"
        name="phone_number"
        placeholder="Phone Number"
        autoComplete="tel"
        onChange={handleChange}
      />

      <button type="submit">Register</button>
    </form>
  );
}
