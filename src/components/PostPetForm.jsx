// src/components/PostPetForm.jsx
import { useState, useMemo } from "react";
import { useNavigate }      from "react-router-dom";
import Select               from "react-select";
import { State, City }      from "country-state-city";

const petTypes      = ["Dog", "Cat", "Other"];
const statusOptions = ["Lost", "Found"];

export default function PostPetForm({ token }) {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    name:        "",
    type:        petTypes[0],
    status:      statusOptions[0],
    description: "",
    image_url:   "",
    state:       null,   // will hold { value, label }
    city:        null,   // will hold { value, label }
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // build react-select options for states once
  const stateOptions = useMemo(
    () =>
      State.getStatesOfCountry("US").map((st) => ({
        value: st.isoCode,
        label: st.name,
      })),
    []
  );

  // when state changes, recompute cityOptions
  const cityOptions = useMemo(() => {
    if (!form.state) return [];
    return City.getCitiesOfState("US", form.state.value).map((ct) => ({
      value: ct.name,
      label: ct.name,
    }));
  }, [form.state]);

  const handleSelect = (field) => (selection) => {
    setForm((f) => ({
      ...f,
      [field]: selection,
      // clear city if state changes
      ...(field === "state" ? { city: null } : {}),
    }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ensure they picked valid options
    if (!form.state || !form.city) {
      setError("Please select both state and city from the dropdowns.");
      return;
    }

    setLoading(true);
    setError("");

    // build "City, StateName"
    const location = `${form.city.value}, ${form.state.label}`;

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:        form.name,
          type:        form.type,
          status:      form.status,
          description: form.description,
          image_url:   form.image_url,
          location,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post pet.");
      }
      navigate("/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-pet-form" onSubmit={handleSubmit}>
      <h2>Post a Pet</h2>

      <div className="form-group">
        <label>Pet Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Buddy"
          required
        />
      </div>

      <fieldset className="form-group">
        <legend>Type</legend>
        <div className="inline-group">
          {petTypes.map((t) => (
            <label key={t}>
              <input
                type="radio"
                name="type"
                value={t}
                checked={form.type === t}
                onChange={handleChange}
              />{" "}
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>Status</legend>
        <div className="inline-group">
          {statusOptions.map((s) => (
            <label key={s}>
              <input
                type="radio"
                name="status"
                value={s}
                checked={form.status === s}
                onChange={handleChange}
              />{" "}
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief details…"
          required
        />
      </div>

      <div className="form-group">
        <label>Image URL (optional)</label>
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://…"
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <Select
          options={stateOptions}
          value={form.state}
          onChange={handleSelect("state")}
          placeholder="Select state…"
          isClearable
        />
      </div>

      <div className="form-group">
        <label>City</label>
        <Select
          options={cityOptions}
          value={form.city}
          onChange={handleSelect("city")}
          placeholder="Select city…"
          isDisabled={!form.state}
          isClearable
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post Pet"}
      </button>
    </form>
  );
}
