import React, { useEffect, useState } from 'react'
import api from '../../api/apiClient'
import { useAuth } from '../../hooks/useAuth'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import ErrorBoundary from '../../components/ErrorBoundary'

export default function Ikigai() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [chartWidth, setChartWidth] = useState(500)
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateWidth = () => {
      const container = document.querySelector('.chart-container')
      if (container) {
        setChartWidth(Math.min(500, container.offsetWidth - 40))
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Fetch dynamic questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const q = await api.get('/candidate/ikigai/questions')
        setQuestions(q.data?.questions || [])
        setAnswers((q.data?.questions || []).map(() => 5)) // default middle value
      } catch {
        setMsg('Failed to load questions!')
      }
    }
    loadQuestions()
  }, [])

  const submit = async () => {
    setMsg(null)
    if (!user || !user.id) {
      setMsg('You are not logged in or your session expired. Please log in again.');
      return;
    }
    setLoading(true)
    try {
      // send as {key, question, value}
      const payload = questions.map((q, i) => ({ key: q.key, question: q.question, value: answers[i] }))
      const r = await api.post('/candidate/ikigai', { userId: user.id, answers: payload });
      setMsg('Your Ikigai profile is saved!');
      // Use setTimeout to ensure state update happens after React has processed the response
      setTimeout(() => {
        setResult(r.data?.scores);
      }, 100);
    } catch (err) {
      setMsg('Submission failed!'+(err?.response?.data?.error ? (': '+err.response.data.error) : ''));
    }
    setLoading(false)
  }

  // For summary
  const strengths = result && Object.entries(result)
    .filter(([_, v]) => v === Math.max(...Object.values(result)))
    .map(([k]) => k[0].toUpperCase() + k.slice(1)).join(' & ')

  // Prepare chart data safely
  const chartData = result && Object.keys(result).length > 0 
    ? Object.entries(result).map(([key, value]) => ({ 
        subject: key[0].toUpperCase() + key.slice(1), 
        A: Number(value) || 0 
      }))
    : []

  return (
    <div className="max-w-3xl mx-auto bg-white p-7 rounded shadow-sm">
      <h2 className="font-bold text-2xl mb-2 text-indigo-700">Ikigai Self-Discovery</h2>
      <div className="mb-3 text-gray-700">
        Find your sweet spot for happiness and impact at work! This simple quiz helps you reflect on what energizes you, what feels meaningful, your natural strengths, and where your work is valued. Answer honestly—there are no wrong answers.
      </div>

      <div className="space-y-7 mb-7">
        {questions.map((q, i) => (
          <div key={q.key || i} className="">
            <label className="font-semibold text-gray-800">{q.question}</label>
            <div className="text-xs text-gray-500 mb-1">{q.help}</div>
            <input type="range" min={1} max={10} value={answers[i]}
              onChange={e => {
                const arr = [...answers]; arr[i]=parseInt(e.target.value); setAnswers(arr)
              }}
              className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span><span>10</span>
            </div>
            <div className="text-sm mt-1 font-mono text-indigo-800">{answers[i]}</div>
          </div>
        ))}
      </div>
      <button onClick={submit} disabled={loading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded shadow hover:bg-indigo-700 transition mb-4">
        {loading ? 'Submitting...' : 'Submit Ikigai'}
      </button>
      {msg && <div className="my-2 text-sm text-green-800 font-semibold">{msg}</div>}

      {result && mounted && chartData.length > 0 && (
        <div className="mt-8 bg-gray-50 p-4 rounded-xl shadow-inner">
          <h3 className="font-bold text-lg mb-1 text-indigo-700">Your Ikigai Profile</h3>
          <div className="w-full flex flex-col md:flex-row md:items-center gap-6">
            <div className="md:w-2/3 w-full chart-container">
              <ErrorBoundary 
                onError={() => setChartError(true)}
                fallback={
                  <div className="space-y-4 p-4 bg-white rounded">
                    <h4 className="font-semibold text-gray-800 mb-3">Your Ikigai Scores</h4>
                    {Object.entries(result || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="font-semibold text-gray-700 w-28 text-sm">{key[0].toUpperCase() + key.slice(1)}:</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-8 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${(Number(value) / 10) * 100}%` }}
                          >
                            <span className="text-xs font-bold text-white">{value}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <RadarChart width={chartWidth} height={400} data={chartData} key={JSON.stringify(result)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={14} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tickCount={6} />
                  <Radar name="Ikigai" dataKey="A" stroke="#6366f1" fill="#a5b4fc" fillOpacity={0.5} />
                </RadarChart>
              </ErrorBoundary>
            </div>
            <div className="flex-1">
                <div className="font-semibold text-indigo-800">Highest area(s): <span className="font-bold">{strengths || '-'}</span></div>
                <div className="mt-2 text-gray-700 text-sm">These are your greatest sources of energy and meaning right now. Consider what role, project, or learning path lets you leverage these strengths while also growing in the other dimensions!
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}