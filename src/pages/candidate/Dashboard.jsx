import React from "react";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>

            <div className="space-y-4">
                <Link
                    to="/candidate/import"
                    className="block bg-indigo-600 text-white p-3 rounded text-center"
                >
                    Import LinkedIn / Resume
                </Link>

                <Link
                    to="/candidate/chat"
                    className="block bg-indigo-500 text-white p-3 rounded text-center"
                >
                    Career Chat
                </Link>

                <Link
                    to="/candidate/ikigai"
                    className="block bg-indigo-400 text-white p-3 rounded text-center"
                >
                    Ikigai Test
                </Link>

                <Link
                    to="/candidate/jobs"
                    className="block bg-green-600 text-white p-3 rounded text-center"
                >
                    Job Recommendations
                </Link>

                <Link
                    to="/candidate/jobs/browse"
                    className="block bg-blue-600 text-white p-3 rounded text-center"
                >
                    Browse All Jobs
                </Link>
            </div>
        </div>
    );
}
