import { useState, useEffect } from "react";
import "./Profile.css";

const BASE_URL = "http://localhost:3000"; // Replace with Render URL for deployment

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [savedPets, setSavedPets] = useState([]);
  const [errSavedPets, setErrSavedPets] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || "Failed to fetch profile.");
        }
      } catch (err) {
        setError("Something went wrong.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSavedPets = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${BASE_URL}/api/users/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSavedPets(data);

        if (data === null || data.length === 0) {
          setErrSavedPets("No saved pets found for user.");
        }
      } catch (err) {
        setErrSavedPets("Something went wrong while fetching saved pets.");
      }
    };

    if (user) fetchSavedPets();
  }, [user]);

  /** Handle local state update when user selects new status */
  const handleStatusChange = (petId, newStatus) => {
    setSavedPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, status: newStatus } : p))
    );
  };

  /**Update pet status in the backend */
  const updatePetStatus = async (petId, newStatus) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BASE_URL}/api/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Status updated successfully!");
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Something went wrong.");
    }
  };

  /**Delete a saved pet */
  const deletePet = async (petId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BASE_URL}/api/pets/${petId}/save`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedPets(savedPets.filter((pet) => pet.id !== petId));
        alert("Pet deleted successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete pet.");
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      alert("Something went wrong while deleting the pet.");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      {user ? (
        <>
          <div className="profile-info">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Location:</strong> {user.location}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number}
            </p>
          </div>

          <h3>Saved Pets</h3>
          {savedPets.length > 0 ? (
            <ul>
              {savedPets.map((pet) => (
                <li key={pet.id} className="saved-pet">
                  <p>
                    <strong>Name:</strong> {pet.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {pet.type}
                  </p>
                  <p>
                    <strong>Description:</strong> {pet.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {pet.status}
                  </p>
                  <p>
                    <strong>Location:</strong> {pet.location}
                  </p>
                  <p>
                    <strong>Post Created:</strong>{" "}
                    {new Date(pet.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Posted By:</strong> {pet.owner_username || "Unknown"}
                  </p>

                  {/*Status Update Dropdown */}
                  <div className="status-update">
                    <label htmlFor={`status-${pet.id}`}>Update Status:</label>
                    <select
                      id={`status-${pet.id}`}
                      value={pet.status}
                      onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                    <button onClick={() => updatePetStatus(pet.id, pet.status)}>
                      Update
                    </button>
                  </div>

                  <button onClick={() => deletePet(pet.id)}>Delete Pet</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="error">{errSavedPets}</p>
          )}
        </>
      ) : (
        !error && <p className="loading">Loading...</p>
      )}
    </div>
  );
}