import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
//import NavBar from
import Inbox from "./components/messages/Inbox";
import MessageForm from "./components/messages/MessageForm";
import PetMessages from "./components/messages/PetMessages";

import RegisterForm from "./components/account/RegisterForm";
import LoginForm from "./components/account/LoginForm";
import Profile from "./components/account/Profile";

import "./App.css";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return(
    <div>
      <Routes>
        <Route path="/"element={token ? <Navigate to="/profile"/> : <Navigate to="/login"/>} />
        <Route path="/register" element={<RegisterForm setToken={setToken} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/profile" element={<Profile token={token} />} />
        <Route path="/" element={<Inbox token={token} />} />
        
        <Route
          path="/message-form"
          element={
            <MessageForm
              token={token}
              receiverId={2}
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