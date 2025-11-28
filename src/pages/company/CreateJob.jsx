import React, { useState } from 'react'
import api from '../../api/apiClient'
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [workSetup, setWorkSetup] = useState('remote')
  const [seniority, setSeniority] = useState('Mid')
  const [msg, setMsg] = useState('')
  const router = useNavigate();

  const submit = async () => {
    if (!title.trim()) return setMsg('Job title required')

    const skillsArr = skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const finalWorkSetup = location.trim() === '' ? 'remote' : workSetup

    const payload = {
      title,
      description: desc,
      location,
      workSetup: finalWorkSetup,
      seniority,
      skills_required: skillsArr
    }

    try {
      await api.post('/job/create', payload)
      setMsg('Created')
      router('/company/jobs')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error creating job')
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded">
      <h3 className="font-bold mb-3 text-xl">Create Job</h3>

      {msg && <div className="mb-3 text-sm text-red-500">{msg}</div>}

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Job Title"
      />

      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Job Description"
        rows={4}
      />

      <input
        value={skills}
        onChange={e => setSkills(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Required Skills (comma separated)"
      />

      <input
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Location (leave empty for full Remote)"
      />

      <div className="mb-3">
        <label className="block mb-1 font-medium">Work Setup</label>
        <select
          value={workSetup}
          onChange={e => setWorkSetup(e.target.value)}
          disabled={location.trim() === ''} 
          className="w-full p-2 border rounded"
        >
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">Onsite</option>
        </select>
        {location.trim() === '' && (
          <div className="text-xs text-gray-500 mt-1">
            Location empty → automatically Remote
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Seniority</label>
        <select
          value={seniority}
          onChange={e => setSeniority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Intern">Intern</option>
          <option value="Entry">Entry Level</option>
          <option value="Mid">Mid Level</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
          <option value="Principal">Principal</option>
        </select>
      </div>

      <button
        onClick={submit}
        className="w-full bg-indigo-600 text-white p-2 rounded mt-3"
      >
        Create Job
      </button>
    </div>
  )
}
