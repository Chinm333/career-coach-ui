import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/auth/Login'
import RegisterCandidate from './pages/auth/RegisterCandidate'
import RegisterCompany from './pages/auth/RegisterCompany'
import CandidateDashboard from './pages/candidate/Dashboard'
import ImportProfile from './pages/candidate/ImportProfile'
import Chat from './pages/candidate/Chat'
import Ikigai from './pages/candidate/Ikigai'
import JobRecommendations from './pages/candidate/JobRecommendations'
import BrowseJobs from './pages/candidate/BrowseJobs'
import CompanyDashboard from './pages/company/Dashboard'
import CreateJob from './pages/company/CreateJob'
import JobMatches from './pages/company/JobMatches'
import ViewJobs from './pages/company/ViewJobs'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'


export default function App() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to={user?.role === 'company' ? '/company/dashboard' : '/candidate/dashboard'} replace />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register/candidate" element={<RegisterCandidate />} />
          <Route path="/register/company" element={<RegisterCompany />} />


          <Route path="/candidate" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>}>
          </Route>


          <Route path="/candidate/dashboard" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/import" element={<ProtectedRoute role="candidate"><ImportProfile /></ProtectedRoute>} />
          <Route path="/candidate/chat" element={<ProtectedRoute role="candidate"><Chat /></ProtectedRoute>} />
          <Route path="/candidate/ikigai" element={<ProtectedRoute role="candidate"><Ikigai /></ProtectedRoute>} />
          <Route path="/candidate/jobs" element={<ProtectedRoute role="candidate"><JobRecommendations /></ProtectedRoute>} />
          <Route path="/candidate/jobs/browse" element={<ProtectedRoute role="candidate"><BrowseJobs /></ProtectedRoute>} />


          <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company/create-job" element={<ProtectedRoute role="company"><CreateJob /></ProtectedRoute>} />
          <Route path="/company/jobs" element={<ProtectedRoute role="company"><ViewJobs /></ProtectedRoute>} />
          <Route path="/company/job/:jobId/matches" element={<ProtectedRoute role="company"><JobMatches /></ProtectedRoute>} />


        </Routes>
      </div>
    </div>
  )
}