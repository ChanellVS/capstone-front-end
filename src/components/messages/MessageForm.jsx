import { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { useParams } from "react-router-dom";
import "./MessageForm.css";

const MessageForm = ({ token, onMessageSent }) => {
  const { receiverId, petId } = useParams();
  const isGlobalRoute = receiverId === "global";

  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState(receiverId !== "global" ? receiverId : "");
  const [pet, setPet] = useState(petId && petId !== "0" ? petId : "");
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(isGlobalRoute);
  const socket = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, petRes] = await Promise.all([
          fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/pets", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!userRes.ok || !petRes.ok) throw new Error("Failed to fetch data.");
        setUsers(await userRes.json());
        setPets(await petRes.json());
      } catch {
        setError("Failed to load users or pets.");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => setIsGlobal(isGlobalRoute), [isGlobalRoute]);

  useEffect(() => {
    if (isGlobal) {
      setReceiver("");
      setPet("");
    }
  }, [isGlobal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!content.trim()) {
        setSuccess(null);
        throw new Error("Please enter a valid message.");
      }
      if (!isGlobal && (!receiver || !pet)) {
        throw new Error("Please select both a user and a pet before sending a private message.");
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: isGlobal ? null : parseInt(receiver),
          pet_id: isGlobal ? null : parseInt(pet),
          content,
          is_global: isGlobal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }

      const newMessage = await res.json();
      setContent("");
      setReceiver("");
      setPet("");
      setSuccess("Message sent!");
      if (onMessageSent) onMessageSent(newMessage);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form-container">
      <h2>Send a Message</h2>

      <div className="form-checkbox-group">
        <input
          type="checkbox"
          id="global"
          checked={isGlobal}
          onChange={() => !isGlobalRoute && setIsGlobal(!isGlobal)}
          disabled={isGlobalRoute}
        />
        <label htmlFor="global">Send Global Message</label>
      </div>

      {!isGlobal && (
        <>
          <div className="form-group">
            <label htmlFor="receiver">Send to:</label>
            <select id="receiver" value={receiver} onChange={(e) => setReceiver(e.target.value)} required>
              <option value="">-- Select a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pet">Related to Pet:</label>
            <select
              id="pet"
              value={pet}
              onChange={(e) => setPet(e.target.value)}
              disabled={!receiver}
            >
              <option value="">-- Select a pet --</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="content">Message:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSuccess(null);
          }}
          required
        ></textarea>
      </div>

      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? "Sending..." : "Send Message"}
      </button>

      {!content.trim() && !success && <p className="warning-msg">Please enter a valid message.</p>}
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </form>
  );
};

export default MessageForm;