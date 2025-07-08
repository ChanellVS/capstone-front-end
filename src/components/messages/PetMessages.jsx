//Displays all messages related to a specific pet id
import { useEffect, useState } from "react";
import InboxRow from "./InboxRow";

const PetMessages = ({ petId, token }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetMessages = async () => {
      try {
        const res = await fetch(`/api/messages/pet/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load messages for this pet.");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchPetMessages();
  }, [petId, token]);

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleEdit = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
  };

  return (
    <div>
      <h3>Messages for This Pet</h3>
      {loading && <p>Loading messages...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p>No messages for this pet.</p>
      )}
      {messages.length > 0 && (
        <ul>
          {messages.map((message) => (
            <InboxRow
              key={message.id}
              message={message}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default PetMessages;

