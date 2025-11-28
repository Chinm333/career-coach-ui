import React, { useEffect, useState } from 'react'
import api from '../../api/apiClient'
import { useParams } from 'react-router-dom'

export default function JobMatches() {
    const { jobId } = useParams()
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('score') // 'score' or 'name'
    const [minScore, setMinScore] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadMatches()
    }, [jobId, page])

    const loadMatches = async () => {
        setLoading(true)
        try {
            const r = await api.get(`/job/${jobId}/match`, { params: { page, limit: 10 } })
            setMatches(r.data?.data || r.data?.results || [])
            setTotalPages(r.data?.totalPages || 1)
            setTotal(r.data?.total || 0)
        } catch (err) {
            console.error('Failed to load matches:', err)
        }
        setLoading(false)
    }

    const filteredAndSorted = matches
        .filter(m => m.score >= minScore)
        .sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
            return 0
        })

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-yellow-500'
        if (score >= 40) return 'bg-orange-500'
        return 'bg-red-500'
    }

    const getIkigaiLabel = (key) => {
        const labels = { passion: 'Passion', mission: 'Mission', vocation: 'Vocation', mastery: 'Mastery' }
        return labels[key] || key
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Candidate Matches</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={e => setSortBy(e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="score">Match Score</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Min Score:</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={minScore} 
                            onChange={e => setMinScore(Number(e.target.value))}
                            className="border rounded px-3 py-1 text-sm w-20"
                        />
                    </div>
                    <div className="ml-auto text-sm text-gray-600">
                        Showing {filteredAndSorted.length} of {total} candidates
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading matches...</p>
                </div>
            ) : filteredAndSorted.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No matches found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {filteredAndSorted.map((match, i) => (
                            <div key={match.candidate_id || i} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {(match.name || 'U')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{match.name || 'Anonymous Candidate'}</h3>
                                                <p className="text-sm text-gray-500">Candidate ID: {match.candidate_id?.slice(-8) || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(match.score)} text-white font-bold text-lg`}>
                                            <span>{match.score}%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Match Score</p>
                                    </div>
                                </div>

                                {match.skills && match.skills.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {match.skills.slice(0, 10).map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                            {match.skills.length > 10 && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                    +{match.skills.length - 10} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {match.workHistory && match.workHistory.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Experience</h4>
                                        <div className="space-y-2">
                                            {match.workHistory.map((job, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <span className="font-medium text-gray-800">{job.title}</span>
                                                    <span className="text-gray-500"> at </span>
                                                    <span className="font-medium text-gray-700">{job.company}</span>
                                                    {job.current && (
                                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Current</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {match.education && match.education.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Education</h4>
                                        {match.education.map((edu, idx) => (
                                            <div key={idx} className="text-sm text-gray-700">
                                                <span className="font-medium">{edu.degree}</span>
                                                <span className="text-gray-500"> from </span>
                                                <span className="font-medium">{edu.school}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {match.ikigai && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Ikigai Profile</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {Object.entries(match.ikigai).map(([key, value]) => (
                                                <div key={key} className="bg-gray-50 rounded p-2">
                                                    <div className="text-xs text-gray-600 mb-1">{getIkigaiLabel(key)}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-indigo-600 h-2 rounded-full"
                                                                style={{ width: `${(value / 10) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">{value}/10</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm font-medium">
                                        View Profile
                                    </button>
                                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium">
                                        Contact
                                    </button>
                                    <button className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition text-sm font-medium">
                                        Shortlist
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