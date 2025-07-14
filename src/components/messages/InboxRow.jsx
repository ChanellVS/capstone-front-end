import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const InboxRow = ({ message, onDelete, onEdit }) => {
  if (!message) return null;

  const {
    id,
    sender_username,
    receiver_username,
    sender_id,
    pet_id,
    content,
    created_at,
    direction,
    is_global,
  } = message;

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!res.ok) throw new Error("Failed to update message");
      const updated = await res.json();
      if (onEdit) onEdit(updated);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete message");
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error(error);
    }
  };

  const displayUser =
    direction === "sent"
      ? receiver_username || "Everyone"
      : sender_username || (is_global ? "Unknown Sender" : "Unknown");

  const directionLabel = direction === "sent" ? "To" : "From";

  return (
    <li>
      <p>
        <strong>{directionLabel}:</strong> {displayUser}
      </p>
      <p>
        <small>{new Date(created_at).toLocaleString()}</small>
      </p>

      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            className="edit-textarea"
            autoFocus
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>{content}</p>

          {direction === "sent" && (
            <div>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}

          {direction !== "sent" && (
            <div>
              {is_global ? (
                <Link to={`/message-form/global`}>
                  <button>Reply to Everyone</button>
                </Link>
              ) : (
                <Link to={`/message-form/${sender_id}/${pet_id || 0}`}>
                  <button>Reply</button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default InboxRow;
