import { useState, useEffect } from "react";

const BASE_URL = 'http://localhost:3000'; // I will Replace with Render URL later for deployment

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError('Something went wrong.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
