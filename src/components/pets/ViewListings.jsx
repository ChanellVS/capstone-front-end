import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PetSearchBar from "./PetSearchBar";
import "./ViewListings.css";

export default function ViewListings() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    fetch("/api/pets")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch listings.");
        return r.json();
      })
      .then((data) => {
        setPets(data);
        setFilteredPets(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePetSearch = ({ query, type, status }) => {
    const filtered = pets.filter((pet) => {
      const matchesQuery =
        pet.name?.toLowerCase().includes(query.toLowerCase()) ||
        pet.location?.toLowerCase().includes(query.toLowerCase());

      const matchesType = type ? pet.type === type : true;
      const matchesStatus = status ? pet.status === status : true;

      return matchesQuery && matchesType && matchesStatus;
    });

    setFilteredPets(filtered);
    setIsFiltered(true);
  };

  const handleClearSearch = () => {
    setFilteredPets(pets);
    setIsFiltered(false);
  };

  return (
    <div className="listings-page">
      <h2 className="listings-heading">All Pet Listings</h2>

      <PetSearchBar onSearch={handlePetSearch} />

      {isFiltered && (
        <button className="clear-search-button" onClick={handleClearSearch}>
          Return to All Listings
        </button>
      )}

      {loading ? (
        <div className="loading-placeholder" aria-live="polite">
          <p>Loading listings…</p>
          <div style={{ minHeight: "400px" }} />
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredPets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <ul className="pet-list">
          {filteredPets.map((pet) => (
            <li key={pet.id} className="pet-card">
              <Link to={`/pet/${pet.id}`} className="pet-card-link">
                <div>
                  {pet.image_url && (
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="pet-thumbnail"
                    />
                  )}
                  <h3>
                    {pet.name} <small>({pet.status})</small>
                  </h3>
                  <p>{pet.description}</p>
                  <p>
                    <em>Location:</em> {pet.location}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}