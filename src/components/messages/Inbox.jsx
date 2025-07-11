import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import InboxRow from "./InboxRow.jsx";

const Inbox = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/messages/inbox", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch messages.");

                const data = await res.json();
                setMessages(data);
            } catch (error) {
                setError(error.message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [token]);

    useEffect(() => {
        if (!socket) return;
    
        const handleNewMessage = (newMessage) => {
            setMessages((prev) => {
                const exists = prev.some((msg) => msg.id === newMessage.id);
                return exists ? prev : [newMessage, ...prev];
            });
        };
    
        socket.on("receive_message", handleNewMessage);
    
        return () => {
            socket.off("receive_message", handleNewMessage);
        };
    }, [socket]);
    

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
            <h2>Your Messages</h2>
            {loading && <p>Loading messages...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && messages.length === 0 && <p>No messages found</p>}
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

export default Inbox;

