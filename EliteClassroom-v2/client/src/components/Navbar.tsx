import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { LogOut, LayoutDashboard, Search, GraduationCap, BookOpen } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data;
      } catch (err) {
        return null;
      }
    },
    retry: false
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
      queryClient.setQueryData(['me'], null);
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition shadow-lg shadow-blue-500/20">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            Elite<span className="text-blue-600">Classroom</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/tutors" className="text-gray-500 hover:text-blue-600 font-bold tracking-tight transition flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Find Tutors
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-6 border-l border-gray-100 pl-10">
              <Link to="/dashboard" className="text-gray-900 hover:text-blue-600 font-black tracking-tight transition flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-black tracking-tight transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-8 border-l border-gray-100 pl-10">
              <Link to="/login" className="text-gray-900 hover:text-blue-600 font-black tracking-tight transition">Sign In</Link>
              <Link to="/register" className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black tracking-tight hover:bg-gray-800 transition shadow-xl hover:shadow-gray-900/10 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
