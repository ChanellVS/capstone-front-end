//Fetches and lists all messages for the logged-in user
import { useEffect, useState } from "react";
import InboxRow from "./InboxRow.jsx";

const Inbox = ({token}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await fetch ('api/messages')
            }
        }
    })
}