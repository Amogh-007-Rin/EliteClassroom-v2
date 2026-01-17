import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
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
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
