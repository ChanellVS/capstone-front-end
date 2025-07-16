// src/components/PetDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

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
  if (!pet)  return <p>Loading pet…</p>;

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

      <div style={{ marginTop: 16 }}>
        <Link to="/posts">← Back to listings</Link>{" "}
        |{" "}
        <Link to={`/pet/${petId}/messages`}>
          View / Send Messages
        </Link>
      </div>
    </div>
  );
}
