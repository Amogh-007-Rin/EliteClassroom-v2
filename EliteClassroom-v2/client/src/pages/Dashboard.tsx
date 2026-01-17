import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Calendar, Clock, Video, ChevronRight, GraduationCap, LayoutDashboard, Settings, LogOut, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    }
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/me');
      return res.data;
    }
  });

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold tracking-tight">Loading your workspace...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 flex">
      {/* Sidebar Nav - Desktop */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: Calendar, label: 'My Bookings' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-50'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-50">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {user.role} Workspace
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Welcome back, {user.firstName}!
              </h1>
            </div>
            <Link 
              to="/tutors" 
              className="inline-flex items-center bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>Explore Tutors</span>
            </Link>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">Upcoming Sessions</h2>
                  <span className="text-blue-600 font-bold text-sm cursor-pointer hover:underline">View All</span>
                </div>
                
                <div className="divide-y divide-gray-50">
                  {bookings?.length === 0 ? (
                    <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                      <Calendar className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-bold text-lg">No sessions scheduled yet.</p>
                      <p className="text-sm">Time to book your first lesson!</p>
                    </div>
                  ) : (
                    bookings?.map((booking: any) => (
                      <div key={booking.id} className="p-8 hover:bg-gray-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-black">
                             {user.role === 'STUDENT' ? booking.tutor.firstName[0] : booking.student.firstName[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 text-lg">
                              {user.role === 'STUDENT' 
                                ? `${booking.tutor.firstName} ${booking.tutor.lastName}`
                                : `${booking.student.firstName} ${booking.student.lastName}`
                              }
                            </h4>
                            <div className="flex items-center text-gray-500 text-sm font-bold mt-1">
                              <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                              <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 ml-3 mr-1.5 text-blue-500" />
                              <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                          <Link 
                            to={`/room/${booking.id}`}
                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                          >
                            <Video className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Student Tip</h3>
                  <p className="text-blue-50 leading-relaxed font-medium mb-6">
                    Consistency is the key to mastering any subject. Try to schedule at least 2 sessions per week for optimal results.
                  </p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center shadow-xl">
                    <span>View Study Guide</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
              </section>

              <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Learning Activity</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Completed Lessons', val: '12', color: 'blue' },
                    { label: 'Study Hours', val: '45.5', color: 'indigo' },
                    { label: 'Avg. Progress', val: '88%', color: 'green' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-gray-500 font-bold">{stat.label}</span>
                      <span className={`text-${stat.color}-600 font-black text-lg`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
