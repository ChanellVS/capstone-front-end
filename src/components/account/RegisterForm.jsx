import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const BASE_URL = 'http://localhost:3000'; // I will Change to Render URL when deploying

export default function RegisterForm({setToken}) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', location: '', phone_number: '' });
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

      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="phone_number" placeholder="Phone Number" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
