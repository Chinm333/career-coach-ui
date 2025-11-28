import React, { useEffect, useState } from 'react'
import api from '../../api/apiClient'

export default function BrowseJobs() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('date') // 'date' or 'title'
    const [workSetupFilter, setWorkSetupFilter] = useState('all')
    const [seniorityFilter, setSeniorityFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadJobs()
    }, [page])

    const loadJobs = async () => {
        setLoading(true)
        try {
            const r = await api.get('/job/all', { params: { page, limit: 12 } })
            setJobs(r.data?.data || [])
            setTotalPages(r.data?.totalPages || 1)
            setTotal(r.data?.total || 0)
        } catch (err) {
            console.error('Failed to load jobs:', err)
        }
        setLoading(false)
    }

    const filteredAndSorted = jobs
        .filter(job => {
            const setupMatch = workSetupFilter === 'all' || job.workSetup === workSetupFilter
            const seniorityMatch = seniorityFilter === 'all' || job.seniority?.toLowerCase() === seniorityFilter.toLowerCase()
            return setupMatch && seniorityMatch
        })
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at)
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
            return 0
        })

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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse All Jobs</h2>
                <p className="text-gray-600 mb-4">Explore all available job opportunities</p>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={e => setSortBy(e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="date">Newest First</option>
                            <option value="title">Title A-Z</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Work Setup:</label>
                        <select 
                            value={workSetupFilter} 
                            onChange={e => setWorkSetupFilter(e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Seniority:</label>
                        <select 
                            value={seniorityFilter} 
                            onChange={e => setSeniorityFilter(e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>
                    <div className="ml-auto text-sm text-gray-600">
                        Showing {filteredAndSorted.length} of {total} jobs
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
            ) : filteredAndSorted.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No jobs found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {filteredAndSorted.map((job, i) => (
                            <div key={job._id || i} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-6">
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
                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium">
                                        Apply Now
                                    </button>
                                    <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium">
                                        View Details
                                    </button>
                                    <button className="px-6 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition font-medium">
                                        Save Job
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

