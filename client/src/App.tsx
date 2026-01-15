import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import TutorProfile from './pages/TutorProfile'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
          <Link to="/" className="font-semibold">EliteClassroom</Link>
          <div className="ml-auto flex gap-3">
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
