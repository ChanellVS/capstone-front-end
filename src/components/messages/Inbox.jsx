import { useEffect } from "react";
import InboxRow from "./InboxRow.jsx";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const Inbox = ({ token, messages, setMessages }) => {
  const socket = useSocket();

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages/inbox", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages.");
      
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages(); // Initial load

    if (socket) {
      socket.on("receive_message", () => {
        fetchMessages(); // Refresh when a new message is received
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, token]);

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleEdit = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === updatedMessage.id
          ? { ...msg, content: updatedMessage.content }
          : msg
      )
    );
  };

  return (
    <div>
      <h2>Your Messages</h2>

      <Link to="/message-form" className="compose-button">
        Compose New Message
      </Link>

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="message-list">
          {messages.map((message) => (
            <InboxRow
              key={message.id}
              message={message}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;