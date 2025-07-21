import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MapView from "../MapView";
import { jwtDecode } from "jwt-decode";
import "./PetDetail.css";

export default function PetDetail({ token }) {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/pets/${petId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error("Pet not found");
        return r.json();
      })
      .then(setPet)
      .catch((e) => setError(e.message));
  }, [petId, token]);

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const timestamp = new Date().toISOString();

    try {
      const response = await fetch(`/api/pets/${petId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          pet_id: petId,
          saved_at: timestamp,
        }),
      });

      if (response.ok) {
        alert("Pet saved successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save pet.");
      }
    } catch (err) {
      console.error("Error saving pet:", err);
      alert("Something went wrong while saving the pet.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!pet) return <p className="loading">Loading pet…</p>;

  return (
    <div className="pet-detail-container">
      <div className="pet-header">
        <h2>{pet.name}</h2>
      </div>

      {pet.image_url && (
        <img
          src={pet.image_url}
          alt={pet.name}
          className="pet-detail-image"
        />
      )}

      <div className="pet-info">
        <p><strong>Status:</strong> {pet.status}</p>
        <p><strong>Description:</strong> {pet.description}</p>
        <p><strong>Last seen:</strong> {pet.location}</p>
      </div>

      {pet.lat != null && pet.lng != null && (
        <div className="pet-map-wrapper">
          <MapView
            center={[pet.lat, pet.lng]}
            zoom={13}
            markers={[
              {
                position: [pet.lat, pet.lng],
                label: `${pet.name} was last seen here.`,
              },
            ]}
          />
        </div>
      )}

      <div className="pet-button-group">
        <Link to="/posts" className="nav-button-link">
          <button className="nav-button">← Back to Listings</button>
        </Link>

        <Link to={`/messages/pet/${petId}`} className="nav-button-link">
          <button className="nav-button">View / Send Messages</button>
        </Link>

        <button className="nav-button save-button" onClick={handleSave}>
          Save Pet
        </button>
      </div>
    </div>
  );
}