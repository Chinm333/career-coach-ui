import React, { useState } from "react";
import api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from 'react-router-dom'

export default function RegisterCompany() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const r = await api.post("/auth/register/company", {
                email,
                password,
                companyName,
                website,
                description,
            });

            const { accessToken, refreshToken, user } = r.data;
            await login({ accessToken, refreshToken, user });

            navigate("/company/dashboard", { replace: true });
        } catch (e) {
            setErr(e.response?.data?.error || e.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
                <h2 className="text-3xl font-extrabold text-primary-dark mb-1 text-center drop-shadow-sm">Register Company</h2>
                <div className="text-gray-500 font-medium mb-6 text-center">Create an employer account</div>
                {err && <div className="text-red-500 mb-3 text-sm rounded-lg bg-red-50 px-4 py-2 border border-red-200 text-center">{err}</div>}
                <form onSubmit={submit} className="space-y-5">
                    <div className="relative">
                        <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder=" " required className="peer w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 transition outline-none text-gray-800" />
                        <span className="absolute left-3 top-2 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Company Name</span>
                    </div>
                    <div className="relative">
                        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder=" " className="peer w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 transition outline-none text-gray-800" />
                        <span className="absolute left-3 top-2 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Website (optional)</span>
                    </div>
                    <div className="relative">
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder=" " required className="peer w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 transition outline-none text-gray-800 min-h-[66px] resize-y" />
                        <span className="absolute left-3 top-2 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Company Description</span>
                    </div>
                    <div className="relative">
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder=" " required className="peer w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 transition outline-none text-gray-800" />
                        <span className="absolute left-3 top-2 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Email</span>
                    </div>
                    <div className="relative">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " required className="peer w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 transition outline-none text-gray-800" />
                        <span className="absolute left-3 top-2 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Password</span>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary-dark transition text-white font-bold p-3 rounded-xl shadow-md text-lg" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                </form>
            </div>
        </div>
    );
}
