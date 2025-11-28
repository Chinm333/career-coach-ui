import React, { useEffect, useState } from 'react'
import api from '../../api/apiClient'
import { Link } from 'react-router-dom'

export default function ViewJobs() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        loadJobs()
    }, [page])

    const assignLegacyJobs = async () => {
        setAssigning(true)
        try {
            const r = await api.post('/job/company/assign-legacy')
            alert(`Assigned ${r.data.modifiedCount} legacy jobs to your company!`)
            loadJobs() // Reload to show the newly assigned jobs
        } catch (err) {
            alert('Failed to assign jobs: ' + (err.response?.data?.error || err.message))
        }
        setAssigning(false)
    }

    const loadJobs = async () => {
        setLoading(true)
        try {
            const r = await api.get('/job/company/jobs', { params: { page, limit: 10 } })
            setJobs(r.data?.data || [])
            setTotalPages(r.data?.totalPages || 1)
            setTotal(r.data?.total || 0)
        } catch (err) {
            console.error('Failed to load jobs:', err)
        }
        setLoading(false)
    }

    const getSeniorityBadge = (seniority) => {
        const colors = {
            junior: 'bg-blue-100 text-blue-700',
            mid: 'bg-purple-100 text-purple-700',
            senior: 'bg-indigo-100 text-indigo-700'
        }
        return colors[seniority?.toLowerCase()] || 'bg-gray-100 text-gray-700'
    }

    const getWorkSetupIcon = (setup) => {
        const icons = { remote: '🏠', hybrid: '🔄', onsite: '🏢' }
        return icons[setup] || '📍'
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Job Postings</h2>
                        <p className="text-gray-600 mt-1">Manage and view all your posted jobs</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={assignLegacyJobs}
                            disabled={assigning}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-medium disabled:opacity-50"
                        >
                            {assigning ? 'Assigning...' : 'Claim Legacy Jobs'}
                        </button>
                        <Link
                            to="/company/create-job"
                            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium"
                        >
                            + Create New Job
                        </Link>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No jobs posted yet</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first job posting to get started</p>
                    <Link
                        to="/company/create-job"
                        className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Create Job
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {jobs.length} of {total} jobs
                    </div>
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeniorityBadge(job.seniority)}`}>
                                                {job.seniority || 'Mid'} Level
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            {job.location && (
                                                <span className="flex items-center gap-1">
                                                    📍 {job.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                {getWorkSetupIcon(job.workSetup)} {job.workSetup || 'Onsite'}
                                            </span>
                                            <span className="text-gray-400">
                                                Posted {new Date(job.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {job.description && (
                                            <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                                        )}
                                    </div>
                                </div>

                                {job.skillsNeeded && job.skillsNeeded.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skillsNeeded.slice(0, 10).map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skillsNeeded.length > 10 && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                    +{job.skillsNeeded.length - 10} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <Link
                                        to={`/company/job/${job._id}/matches`}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium"
                                    >
                                        View Matches
                                    </Link>
                                    <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium">
                                        Edit Job
                                    </button>
                                    <button className="px-6 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition font-medium">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

