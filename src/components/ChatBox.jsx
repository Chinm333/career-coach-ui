import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatBox({ onSend, history = [] }) {
    const [q, setQ] = useState("");
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (q.trim()) {
            onSend(q);
            setQ("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    return (
        <div className="flex flex-col">
            <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto pr-2">
                {history.map((h, i) => (
                    <div key={i} className="rounded-lg shadow-sm p-4 border bg-gradient-to-tr from-blue-50 to-green-50">
                        <div className="text-xs font-semibold text-blue-800 mb-1">User:</div>
                        <div className="mb-3 break-words text-gray-900">{h.question}</div>
                        <div className="text-xs font-semibold text-green-800 mb-1">AI Coach:</div>
                        <div className="prose prose-sm max-w-none text-gray-800">
                            <ReactMarkdown>{h.answer}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Type your message"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300 outline-none"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <div className="flex gap-2 mt-2">
                <button onClick={handleSend} className="bg-indigo-600 text-white p-2 px-4 rounded shadow-md font-bold">Send</button>
            </div>
        </div>
    );
}