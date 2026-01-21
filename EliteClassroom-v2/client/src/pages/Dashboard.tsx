import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import ReviewModal from '../components/ReviewModal';
import { Calendar, Clock, Video, ChevronRight, GraduationCap, LayoutDashboard, Settings, LogOut, BookOpen, Save, CheckCircle, XCircle, Star } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

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

  const { data: tutorProfile } = useQuery({
    queryKey: ['tutorProfile'],
    queryFn: async () => {
      const res = await api.get('/tutors/profile');
      return res.data;
    },
    enabled: !!user && user.role === 'TUTOR',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put('/tutors/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorProfile'] });
      alert('Profile updated successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/reviews', data);
    },
    onSuccess: () => {
      setReviewModalOpen(false);
      alert('Review submitted successfully!');
      setComment('');
      setRating(5);
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to submit review');
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return api.patch(`/bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      alert('Booking status updated!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to update booking');
    }
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

  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    subjects: '',
    verified: false,
  });

  useEffect(() => {
    if (tutorProfile) {
      setFormData({
        bio: tutorProfile.bio || '',
        hourlyRate: tutorProfile.hourlyRate || '',
        subjects: tutorProfile.subjects?.map((s: any) => s.subject.name).join(', ') || '',
        verified: tutorProfile.verified || false,
      });
    }
  }, [tutorProfile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      ...formData,
      subjects: formData.subjects.split(',').map((s: string) => s.trim()).filter(Boolean),
    });
  };


  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold tracking-tight">Loading your workspace...</p>
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-gray-50/30 flex">
      {/* Sidebar Nav - Desktop */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
            { icon: Calendar, label: 'My Bookings', id: 'bookings' },
            { icon: Settings, label: 'Settings', id: 'settings' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Content moved inside this div */}
        </div>
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

          {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">Upcoming Sessions</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-blue-600 font-bold text-sm cursor-pointer hover:underline">View All</button>
                </div>
                
                <div className="divide-y divide-gray-50">
                  {bookings?.filter((b: any) => b.status === 'CONFIRMED' && new Date(b.startTime) > new Date()).length === 0 ? (
                    <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                      <Calendar className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-bold text-lg">No upcoming sessions.</p>
                      <p className="text-sm">Time to book your first lesson!</p>
                    </div>
                  ) : (
                    bookings?.filter((b: any) => b.status === 'CONFIRMED' && new Date(b.startTime) > new Date()).map((booking: any) => (
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
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-8">
               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="text-xl font-black text-gray-900">My Bookings</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                     {bookings?.length === 0 ? (
                        <div className="p-20 text-center text-gray-400">
                           <Calendar className="w-12 h-12 mb-4 mx-auto opacity-20" />
                           <p className="font-bold text-lg">No bookings found.</p>
                        </div>
                     ) : (
                        bookings?.map((booking: any) => (
                           <div key={booking.id} className="p-8 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                                    {user.role === 'STUDENT' ? booking.tutor?.firstName?.[0] : booking.student?.firstName?.[0]}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900 text-lg">
                                       {user.role === 'STUDENT' ? `${booking.tutor?.firstName} ${booking.tutor?.lastName}` : `${booking.student?.firstName} ${booking.student?.lastName}`}
                                    </h4>
                                    <div className="flex items-center text-gray-500 text-sm font-medium mt-1">
                                       <Calendar className="w-4 h-4 mr-1.5" />
                                       <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                       <Clock className="w-4 h-4 ml-4 mr-1.5" />
                                       <span>{new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                                    booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                 }`}>
                                    {booking.status}
                                 </span>
                                 {user.role === 'STUDENT' && (
                                    <button 
                                      onClick={() => {
                                         setSelectedBooking(booking);
                                         setReviewModalOpen(true);
                                      }}
                                      className="p-2 text-gray-400 hover:text-yellow-500 transition"
                                      title="Leave a Review"
                                    >
                                       <Star className="w-5 h-5" />
                                    </button>
                                 )}
                                 {user.role === 'TUTOR' && booking.status === 'PENDING' && (
                                    <>
                                       <button 
                                         onClick={() => updateBookingMutation.mutate({id: booking.id, status: 'CONFIRMED'})}
                                         className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                                       >
                                         Accept
                                       </button>
                                       <button 
                                         onClick={() => updateBookingMutation.mutate({id: booking.id, status: 'CANCELLED'})}
                                         className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200 transition"
                                       >
                                         Decline
                                       </button>
                                    </>
                                 )}
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Profile Settings</h2>
                    {user.role === 'TUTOR' ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Bio</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium min-h-[150px]"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Tell students about yourself..."
                                />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold"
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                        placeholder="0.00"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Verification</label>
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.verified ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => setFormData({...formData, verified: !formData.verified})}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.verified ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="font-bold text-gray-700">{formData.verified ? 'Verified Tutor' : 'Not Verified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Subjects (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold"
                                    value={formData.subjects}
                                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                                    placeholder="Math, Physics, Chemistry..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={updateProfileMutation.isPending}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 flex items-center"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </form>
                    ) : (
                        <p className="text-gray-500">Settings are currently available for tutors only.</p>
                    )}
                </div>
            </div>
          )}
        </main>
      </div>

      <ReviewModal 
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={(r, c) => reviewMutation.mutate({
          tutorId: selectedBooking?.tutor?.id,
          rating: r,
          comment: c
        })}
        tutorName={selectedBooking?.tutor?.firstName}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        isSubmitting={reviewMutation.isPending}
      />
    </>
  );
}

