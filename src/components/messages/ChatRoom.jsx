import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import "./ChatRoom.css";

export default function ChatRoom({ token }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Unable to load user info");
      }
    };

    if (token) fetchUser();
  }, [token]);

  // Fetch previous global messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages/global");
        if (!res.ok) throw new Error("Failed to fetch global messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !token) return;

    socket.on("receive_message", (msg) => {
      if (msg.is_global) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          return exists ? prev : [...prev, msg];
        });
      }
    });

    return () => socket.off("receive_message");
  }, [socket, token]);

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          is_global: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setContent("");

      // Scroll to bottom after sending message
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setError("Unable to send message");
    }
  };

  return (
    <div className="chatroom-container">
      <h3>Community Chat Room</h3>
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="chat-messages">
          {messages.length === 0 && <p>No messages yet. Be the first to say hi!</p>}
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <strong>{msg.sender_username}</strong>: {msg.content}{" "}
              <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      )}
      <div className="chat-input">
        <label htmlFor="chat-message" className="sr-only">
          Type your message
        </label>
        <input
          id="chat-message"
          name="chat-message"
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoComplete="off"
        />
        <button onClick={sendMessage} disabled={!content.trim()}>
          Send
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}