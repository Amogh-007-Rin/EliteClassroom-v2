import { Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';

export default function App() {
  return (
    <div>
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <Link to="/" className="font-bold">EliteClassroom</Link>
          <div className="flex gap-4 text-sm">
            <Link to="/tutors" className="underline">Tutors</Link>
            <Link to="/dashboard" className="underline">Dashboard</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutor/:id" element={<TutorProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </div>
  );
}
