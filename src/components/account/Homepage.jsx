import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../MapView";
import PostPetForm from "../pets/PostPetForm";
import Inbox from "../messages/Inbox";
import Profile from "../account/Profile";
import "leaflet/dist/leaflet.css";
import "./Homepage.css";

export default function Homepage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        const data = await res.json();
        if (data.length > 0) {
          setLatestPosts(data.slice(0, 3));//latests three posts
        }
        setPets(data.filter(pet => pet.lat != null && pet.lng != null));
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    fetchPets();
  }, []);

  return (
    <>
      <div id="home" className="homepage">
        <h1>
          Welcome to 404: Pet Not Found{" "}
          <span>
            <p className="tagline">
              Geolocation: Because calling their name doesn’t always work
            </p>
          </span>
        </h1>
      </div>
     <div id="latest" className="latest-posts">
        <h3>Latest Posts</h3>
        <div className="latest-posts-grid">
          {latestPosts.map((pet) => (
            <div className="post-card" key={pet.id}>
              <p><strong>{pet.name}</strong> ({pet.status})</p>
              <p>{pet.description}</p>
              {pet.image_url && (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="latest-post-image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div id="map" className="pet-map-section">
        <h3>Pet Listings Map</h3>
        <div className="map-and-button">
          {pets.length > 0 && (
            <MapView
              center={[pets[0].lat, pets[0].lng]}
              zoom={13}
              markers={pets.map(pet => ({
                position: [pet.lat, pet.lng],
                label: (
                  <>
                    <strong>{pet.name}</strong>
                    <br />
                    {pet.status}
                    <br />
                    {pet.location}
                  </>
                )
              }))}
            />
          )}
          <Link to="/posts" className="listings-button">View All Listings</Link>
        </div>
      </div>
    </>
  );
}