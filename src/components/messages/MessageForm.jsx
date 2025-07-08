//Used to send a new message (POST)
import { useState } from "react";

const MessageForm = ({ token, receiverId, petId, onMessageSent }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          pet_id: petId,
          content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }

      const newMessage = await res.json();
      setContent("");
      setSuccess("Message sent!");
      if (onMessageSent) onMessageSent(newMessage);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="content">Message:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
};

export default MessageForm;
