import React, { useState } from 'react'
import api from '../../api/apiClient'
import { useAuth } from '../../hooks/useAuth'


export default function ImportProfile() {
    const [text, setText] = useState('')
    const [msg, setMsg] = useState(null)
    const { user } = useAuth()


    const submit = async e => {
        e.preventDefault()
        try {
            const r = await api.post('/candidate/import', { userId: user.id, text })
            setMsg('Imported OK')
        } catch (e) { setMsg('Import failed: ' + (e.response?.data?.error || e.message)) }
    }


    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded">
            <h3 className="font-bold mb-3">Import LinkedIn / Resume text</h3>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={10} className="w-full p-2 border rounded" />
            <div className="flex gap-3 mt-3">
                <button onClick={submit} className="bg-indigo-600 text-white p-2 rounded">Import</button>
                {msg && <div className="text-sm">{msg}</div>}
            </div>
        </div>
    )
}