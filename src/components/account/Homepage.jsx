import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [latestPost, setLatestPost] = useState(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const res = await fetch("/api/pets");
        const data = await res.json();
        if (data.length > 0) {
          setLatestPost(data[0]); // assuming newest first
        }
      } catch (err) {
        console.error("Failed to fetch latest post:", err);
      }
    };

    fetchLatestPost();
  }, []);

  return (
    <div className="homepage">
      <h1>Welcome to 404:Pet Not Found</h1>
      <p>Find and report lost or found pets in your community.</p>

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