import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Homepage() {
  const [latestPost, setLatestPost] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        const data = await res.json();
        if (data.length > 0) {
          setLatestPost(data[0]); // assuming newest first
        }
        setPets(data.filter(pet => pet.lat != null && pet.lng != null));
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="homepage">
      <h1>Welcome to 404:Pet Not Found</h1>
      <p>Find and report lost or found pets in your community.</p>

      {pets.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>Pet Map</h3>
          <MapContainer
            center={[pets[0].lat, pets[0].lng]}
            zoom={4}
            style={{ height: 400, width: "100%", borderRadius: 8 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {pets.map(pet => (
              <Marker key={pet.id} position={[pet.lat, pet.lng]}>
                <Popup>
                  <strong>{pet.name}</strong><br />
                  {pet.status}<br />
                  {pet.location}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <Link to="/posts" className="listings-button">View All Listings</Link>

      {latestPost && (
        <div className="latest-post">
          <h3>Latest Post</h3>
          <p><strong>{latestPost.name}</strong> ({latestPost.status})</p>
          <p>{latestPost.description}</p>
          {latestPost.image_url && (
            <img
              src={latestPost.image_url}
              alt={latestPost.name}
              className="latest-post-image"
            />
          )}
        </div>
      )}
    </div>
  );
}