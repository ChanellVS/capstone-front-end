//Displays all messages related to a specific pet id
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InboxRow from "./InboxRow";
import { useParams } from "react-router-dom";
import "./PetMessages.css"

const PetMessages = ({ token }) => {
  const { petId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetMessages = async () => {
      try {
        setLoading(prev => !prev)
        console.log(token);
        const res = await fetch(`http://localhost:3000/api/messages/pet/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load messages for this pet.");
        const data = await res.json();
        setMessages(data);
        setLoading(prev => !prev)
      } catch (error) {
        console.error(error);
        setError(error.message);
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
     <div className="pet-messages-container">
      <h3>Messages for This Pet</h3>

      {loading && <p>Loading messages...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p>No messages for this pet.</p>
      )}
      <Link
        to={`/message-form/0/${petId}`}
        className="message-button"
        style={{ display: "inline-block", marginBottom: "1rem" }}
      >
        📨 Send a Message About This Pet
      </Link>
      {messages && (
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

