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
        setFilteredPets(data); // initialize filteredPets
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
    setIsFiltered(true); // Mark that search is active
  };

  // ✅ Clear search results and return to full list
  const handleClearSearch = () => {
    setFilteredPets(pets);
    setIsFiltered(false);
  };

  if (loading) return <p>Loading listings…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="listings-page">
      <h2>All Pet Listings</h2>

      <PetSearchBar onSearch={handlePetSearch} />

      {isFiltered && (
        <button className="clear-search-button" onClick={handleClearSearch}>
          Return to All Listings
        </button>
      )}

      {filteredPets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <ul className="pet-list">
          {filteredPets.map((pet) => (
            <Link key={pet.id} to={`/pet/${pet.id}`} className="pet-card-link">
              <li className="pet-card">
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
                <p><em>Location:</em> {pet.location}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}