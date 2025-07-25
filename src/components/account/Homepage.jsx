import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../MapView";
import "leaflet/dist/leaflet.css";
import ChatRoom from "../messages/ChatRoom.jsx";
import "./Homepage.css";

export default function Homepage({ token }) {
  const [latestPosts, setLatestPosts] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        const data = await res.json();
        if (data.length > 0) {
          setLatestPosts(data.slice(0, 3));
        }
        setPets(data.filter((pet) => pet.lat != null && pet.lng != null));
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    fetchPets();
  }, []);

  const scrollToChat = () => {
    const chatSection = document.getElementById("chat-section");
    if (chatSection) {
      window.scrollTo({
        top: chatSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Welcome Section */}
      <div id="home" className="homepage">
        <h1>
          Welcome to 404:Pet Not Found{" "}
          <span>
            <p className="tagline">
              Geolocation: Because calling their name doesn’t always work
            </p>
          </span>
        </h1>

        {/* Go to Chat Button */}
        {token && (
          <div style={{ marginTop: "1.5rem" }}>
            <button className="listings-button" onClick={scrollToChat}>
              Go to Community Chat
            </button>
          </div>
        )}
      </div>

      {/* Map Section */}
      <h3 className="map-header">Pet Listings Map</h3>
      <div className="map-wrapper">
        {pets.length > 0 && (
          <MapView
            center={[pets[0].lat, pets[0].lng]}
            zoom={13}
            markers={pets.map((pet) => ({
              position: [pet.lat, pet.lng],
              label: (
                <>
                  <strong>{pet.name}</strong>
                  <br />
                  {pet.status}
                  <br />
                  {pet.location}
                </>
              ),
            }))}
          />
        )}
      </div>

      {/* Latest Posts */}
      <h3 className="latest-title">Latest Posts</h3>
      <div id="latest" className="homepage-latest">
        <div className="latest-posts-grid">
          {latestPosts.map((pet) => (
            <Link
              to={`/pet/${pet.id}`}
              className="latest-post-card-link"
              key={pet.id}
            >
              <div className="post-card">
                <p>
                  <strong>{pet.name}</strong> ({pet.status})
                </p>
                <p>{pet.description}</p>
                {pet.image_url && (
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="latest-post-image"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="button-wrapper" style={{ marginTop: "2rem" }}>
          <Link to="/posts" className="listings-button">
            View All Listings
          </Link>
        </div>
      </div>

      {/* Chat Room */}
      {token && (
        <div id="chat-section" className="chatroom-wrapper" style={{ marginTop: "3rem" }}>
          <ChatRoom token={token} />
        </div>
      )}
    </>
  );
}