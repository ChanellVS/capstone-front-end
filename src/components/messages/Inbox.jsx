import InboxRow from "./InboxRow.jsx";
import { Link } from "react-router-dom";

const Inbox = ({ token, messages, setMessages }) => {
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

      <Link to="/message-form/2/1" className="compose-button">
        Compose New Message
      </Link>

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
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

export default Inbox;