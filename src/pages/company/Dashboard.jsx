import React from "react";
import { Link } from "react-router-dom";

export default function CompanyDashboard() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>

            <div className="space-y-4">

                <Link
                    to="/company/create-job"
                    className="block bg-indigo-600 text-white p-3 rounded text-center"
                >
                    Create New Job
                </Link>

                <Link
                    to="/company/jobs"
                    className="block bg-indigo-500 text-white p-3 rounded text-center"
                >
                    View All Jobs
                </Link>

            </div>
        </div>
    );
}
