import { useEffect, useState } from "react";
import InboxRow from "./InboxRow.jsx";
import MessageSearchBar from "./MessageSearchBar.jsx";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import "./Inbox.css";

const Inbox = ({ token, messages, setMessages }) => {
  const socket = useSocket();
  const [filteredMessages, setFilteredMessages] = useState(messages);

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
      setFilteredMessages(data); // Update filtered too
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

  // Update filtered messages whenever `messages` changes (e.g. deletion or fetch)
  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

  const handleDelete = (id) => {
    const updated = messages.filter((msg) => msg.id !== id);
    setMessages(updated);
    setFilteredMessages(updated);
  };

  const handleEdit = (updatedMessage) => {
    const updated = messages.map((msg) =>
      msg.id === updatedMessage.id
        ? { ...msg, content: updatedMessage.content }
        : msg
    );
    setMessages(updated);
    setFilteredMessages(updated);
  };

  const handleMessageSearch = (term) => {
    const filtered = messages.filter((msg) => {
      const lower = term.toLowerCase();
      return (
        msg.sender_username?.toLowerCase().includes(lower) ||
        msg.receiver_username?.toLowerCase().includes(lower) ||
        msg.content?.toLowerCase().includes(lower) ||
        msg.pet_name?.toLowerCase().includes(lower)
      );
    });
    setFilteredMessages(filtered);
  };

  return (
    <div className="inbox-container">
      <h2>Your Messages</h2>

      <Link to="/message-form" className="compose-button">
        Compose New Message
      </Link>

      {/*Message Search Bar */}
      <MessageSearchBar onSearch={handleMessageSearch} />

      {filteredMessages.length === 0 ? (
        <p className="message-status">No messages found</p>
      ) : (
        <ul className="message-list">
          {filteredMessages.map((message) => (
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

export default Inbox;