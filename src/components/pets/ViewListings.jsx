import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ViewListings.css"

export default function ViewListings() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pets")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch listings.");
        return r.json();
      })
      .then((data) => setPets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading listings…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="listings-page">
      <h2>All Pet Listings</h2>
      {pets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
      <ul className="pet-list">
        {pets.map((pet) => (
          <Link key={pet.id} to={`/pet/${pet.id}`} className="pet-card-link">
            <li className="pet-card">
              {pet.image_url && (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="pet-thumbnail"
                />
              )}
              <h3>{pet.name} <small>({pet.status})</small></h3>
              <p>{pet.description}</p>
              <p><em>Location:</em> {pet.location}</p>
            </li>
          </Link>
        ))}
      </ul>
      )}
    </div>
  );
}
