// src/components/PetDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import {jwtDecode} from "jwt-decode";

export default function PetDetail({ token }) {

  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/pets/${petId}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    })
      .then((r) => {
        if (!r.ok) throw new Error("Pet not found");
        return r.json();
      })
      .then(setPet)
      .catch((e) => setError(e.message));
  }, [petId, token]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!pet) return <p>Loading pet…</p>;


const handleSave = async () => {
  const token = localStorage.getItem('authToken');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch(`http://localhost:5173/api/pets/${petId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        user_id: userId,
        pet_id: petId,
         saved_at: timestamp,
       })
    });

    if (response.ok) {
      alert('Pet saved successfully!');
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to save pet.');
    }
  } catch (err) {
    console.error('Error saving pet:', err);
    alert('Something went wrong while saving the pet.');
  }
}


  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>{pet.name}</h2>
      {pet.image_url && (
        <img
          src={pet.image_url}
          alt={pet.name}
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 8
          }}
        />
      )}

      <p><strong>Status:</strong> {pet.status}</p>
      <p><strong>Description:</strong> {pet.description}</p>
      <p><strong>Last seen:</strong> {pet.location}</p>

      {pet.lat != null && pet.lng != null && (
        <MapContainer
          center={[pet.lat, pet.lng]}
          zoom={13}
          style={{
            height: 350,
            width: "100%",
            marginTop: 16,
            borderRadius: 8
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[pet.lat, pet.lng]}>
            <Popup>
              {pet.name} was last seen here.
            </Popup>
          </Marker>
        </MapContainer>
      )}
      <div className="button-group">
        <Link to="/posts">
          <button className="nav-button">← Back to Listings</button>
        </Link>

        <Link to={`/messages/pet/${petId}`}>
          <button className="nav-button">View / Send Messages</button>
        </Link>
        <button onClick= {()=>handleSave()}>Save Pet</button>
      </div>
    </div>
  );
}
