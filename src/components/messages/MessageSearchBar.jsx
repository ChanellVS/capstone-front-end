import { useState } from "react";
import "./MessageSearchBar.css";

export default function MessageSearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.toLowerCase());
    }
  };

  return (
    <div className="message-search-container">
      <form className="message-search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Filter</button>
      </form>
    </div>
  );
}