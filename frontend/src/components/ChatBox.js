import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    const handleSend = () => {
        if (input.trim()) {
            socket.emit('chat message', input);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <ul className="messages">
                {messages.map((msg, index) => (
                    <li key={index} className="message">{msg}</li>
                ))}
            </ul>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default ChatBox;
