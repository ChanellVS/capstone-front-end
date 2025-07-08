//Renders each message row with Edit/Delete functionality
import React from "react";
import { useState } from "react";

const InboxRow = ({ message, onDelete, onEdit }) => {
  const {
    id,
    sender_username,
    receiver_username,
    content,
    created_at,
    direction,
  } = message;

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete message");
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li>
      <p>
        <strong>{direction === "sent" ? "To" : "From"}:</strong>
        {direction === "sent" ? receiver_username : sender_username}
      </p>
      <p>
        <small>{new Date(created_at).toLocaleString()}</small>
      </p>

      {editing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            autoFocus
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
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
        </>
      )}
    </li>
  );
};

export default InboxRow;