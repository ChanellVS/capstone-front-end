import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostPetForm({ token }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "",
    description: "",
    image_url: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post pet.");
      }

      // on success, go to listings
      navigate("/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-pet-form">
      <h2>Post a Pet</h2>

      <input
        name="name" placeholder="Pet name"
        value={form.name} onChange={handleChange}
        required
      />

      <input
        name="type" placeholder="Type (Dog, Cat…)"
        value={form.type} onChange={handleChange}
        required
      />

      <input
        name="status" placeholder="Status (Case Sensitive: Lost, Found…)"
        value={form.status} onChange={handleChange}
        required
      />

      <textarea
        name="description" placeholder="Description"
        value={form.description} onChange={handleChange}
        required
      />

      <input
        name="image_url" placeholder="Image URL (optional)"
        value={form.image_url} onChange={handleChange}
      />

      <input
        name="location" placeholder="Location (address or city)"
        value={form.location} onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post Pet"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
