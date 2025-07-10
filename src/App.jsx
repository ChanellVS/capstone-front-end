import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
//import NavBar from
import Inbox from "./components/messages/Inbox";
import MessageForm from "./components/messages/MessageForm";
import PetMessages from "./components/messages/PetMessages";
import { useSocket } from "./context/SocketContext";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || ""
  );
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleGlobalMessage = (msg) => {
      console.log("New message received (global):", msg);
    }

    socket.on("receive_message", handleGlobalMessage);

    return () => {
      socket.off("receive_message", handleGlobalMessage);
    };
  }, [socket]);
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Inbox token={token} />} />
        <Route
          path="/message-form"
          element={
            <MessageForm
              token={token}
              receiverId={1}
              petId={1}
              onMessageSent={(msg) => console.log("Message sent:", msg)}
            />
          }
        />
        <Route
          path="/pet/:id/messages"
          element={<PetMessages token={token} petId={1} />}
        />
      </Routes>
    </div>
  );
}

export default App;