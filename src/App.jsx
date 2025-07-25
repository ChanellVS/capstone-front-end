import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./components/account/Homepage";
import RegisterForm from "./components/account/RegisterForm";
import LoginForm from "./components/account/LoginForm";
import Profile from "./components/account/Profile";
import Inbox from "./components/messages/Inbox";
import MessageForm from "./components/messages/MessageForm";
import PetMessages from "./components/messages/PetMessages";
import ProtectedRoute from "./components/account/ProtectedRoute";
import ViewListings from "./components/pets/ViewListings.jsx";
import PostPetForm from "./components/pets/PostPetForm.jsx";
import PetDetail from "./components/pets/PetDetail.jsx";
import AnimatedPaw from "./components/AnimatedPaw.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import { useSocket } from "./context/SocketContext";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [messages, setMessages] = useState([]);
  const [pets, setPets] = useState([]);
  const socket = useSocket();

  // Disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  // Fetch Messages
  useEffect(() => {
    if (!token) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch messages.");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [token]);

  // Fetch Pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        if (!res.ok) throw new Error("Failed to fetch pets.");
        const data = await res.json();
        setPets(data);
      } catch (err) {
        console.error("Failed to load pets:", err);
      }
    };
    fetchPets();
  }, []);

  // WebSocket setup for real-time messages
  useEffect(() => {
    if (!socket || !token) return;

    const currentUserId = JSON.parse(atob(token.split(".")[1])).id;

    const handleMessage = (msg) => {
      const isRelevant =
        msg.receiver_id === currentUserId ||
        msg.sender_id === currentUserId ||
        msg.receiver_id === null;

      if (!isRelevant) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        return exists ? prev : [msg, ...prev];
      });
    };

    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, [socket, token]);

  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <AnimatedPaw />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage token={token} />} />
        <Route path="/posts" element={<ViewListings allPets={pets} />} />

        <Route
          path="/postPet"
          element={
            <ProtectedRoute token={token}>
              <PostPetForm token={token} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute token={token}>
              <Inbox token={token} messages={messages} setMessages={setMessages} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token}>
              <Profile token={token} />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<RegisterForm setToken={setToken} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />

        <Route
          path="/messages/pet/:petId"
          element={
            <ProtectedRoute token={token}>
              <PetMessages token={token} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pet/:petId"
          element={
            <ProtectedRoute token={token}>
              <PetDetail token={token} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/message-form/:receiverId/:petId"
          element={
            <ProtectedRoute token={token}>
              <MessageForm token={token} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/message-form"
          element={
            <ProtectedRoute token={token}>
              <MessageForm token={token} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;