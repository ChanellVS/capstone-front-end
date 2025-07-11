import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Homepage from "./components/account/Homepage";
import RegisterForm from "./components/account/RegisterForm";
import LoginForm from "./components/account/LoginForm";
import Profile from "./components/account/Profile";
import Inbox from "./components/messages/Inbox";
import MessageForm from "./components/messages/MessageForm";
import PetMessages from "./components/messages/PetMessages";
import ProtectedRoute from "./components/account/ProtectedRoute";

import { useSocket } from "./context/SocketContext";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleGlobalMessage = (msg) => {
      console.log("New message received (global):", msg);
    };

    socket.on("receive_message", handleGlobalMessage);

    return () => {
      socket.off("receive_message", handleGlobalMessage);
    };
  }, [socket]);

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<RegisterForm setToken={setToken} />} />
      <Route path="/login" element={<LoginForm setToken={setToken} />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute token={token}>
            <Profile token={token} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute token={token}>
            <Inbox token={token} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/message-form"
        element={
          <ProtectedRoute token={token}>
            <MessageForm
              token={token}
              receiverId={2}
              petId={1}
              onMessageSent={(msg) => console.log("Message sent:", msg)}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pet/:id/messages"
        element={<PetMessages token={token} />}
      />
    </Routes>
  );
}

export default App;
