import React, { useState, useEffect } from 'react'
import api from '../../api/apiClient'
import { useAuth } from '../../hooks/useAuth'
import ChatBox from '../../components/ChatBox'


export default function Chat() {
    const [history, setHistory] = useState([]);
    const { user } = useAuth();

    const send = async (q) => {
        const r = await api.post('/candidate/chat', { userId: user.id, question: q });
        setHistory(prev => [...prev, { question: r.data.question, answer: r.data.answer }]);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded">
            <h3 className="font-bold mb-3">Career Coach Chat</h3>
            <ChatBox onSend={send} history={history} />
        </div>
    );
}