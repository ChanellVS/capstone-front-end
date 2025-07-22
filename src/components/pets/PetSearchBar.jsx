import { useState } from "react";
import "./PetSearchBar.css";

export default function PetSearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ query, type, status });
        }
    };

    return (
        <div className="pet-search-container">
            <form className="pet-search-bar" onSubmit={handleSubmit}>
                <input
                    className="name-input"
                    type="text"
                    placeholder="Name or location"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}