import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { Calendar, Clock, Star, ShieldCheck, ArrowLeft, ArrowRight, MessageSquare, BookOpen } from 'lucide-react';

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { data: tutor, isLoading } = useQuery({
    queryKey: ['tutor', id],
    queryFn: async () => {
      const res = await api.get(`/tutors/${id}`);
      return res.data;
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return api.post('/bookings', bookingData);
    },
    onSuccess: () => {
      alert('Booking successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Booking failed');
    }
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate({
      tutorId: tutor.user.id,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold">Loading expert profile...</p>
    </div>
  );
  
  if (!tutor) return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
        <h2 className="text-2xl font-black text-red-600 mb-2">Tutor Not Found</h2>
        <p className="text-red-500 mb-6">The profile you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/tutors')} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">Return to Search</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <button 
          onClick={() => navigate('/tutors')}
          className="flex items-center text-gray-500 font-bold hover:text-blue-600 mb-8 transition group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
          <span>Back to Results</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[3rem] -z-0"></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10 mb-10">
                <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 text-3xl font-black">
                  {tutor.user.firstName[0]}{tutor.user.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                      {tutor.user.firstName} {tutor.user.lastName}
                    </h1>
                    <div className="bg-green-100 text-green-600 p-1 rounded-full">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-gray-500 font-bold">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-1.5" />
                      <span className="text-gray-900">4.9</span>
                      <span className="font-medium ml-1">(120 Reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-blue-600 mr-1.5" />
                      <span>{tutor.subjects.length} Subjects</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-4">About the Tutor</h2>
                  <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                    "{tutor.bio}"
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-4">Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {tutor.subjects.map((s: any) => (
                      <span key={s.subject.id} className="bg-gray-50 text-gray-600 px-5 py-2.5 rounded-2xl border border-gray-100 font-black text-sm">
                        {s.subject.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-gray-800 transition shadow-xl active:scale-[0.98]">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                <div>
                  <p className="text-3xl font-black text-blue-600">${tutor.hourlyRate}</p>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Hourly Rate</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>

              <form onSubmit={handleBook} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Lesson Start</label>
                  <div className="relative group">
                    <input 
                      type="datetime-local" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    <Clock className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Lesson End</label>
                  <div className="relative group">
                    <input 
                      type="datetime-local" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                    <Clock className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6">
                  <p className="text-sm text-blue-700 font-bold leading-relaxed">
                    You won't be charged yet. Your booking needs to be confirmed by the tutor.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center group active:scale-[0.98]"
                >
                  <span>{bookingMutation.isPending ? 'Processing...' : 'Request Session'}</span>
                  {!bookingMutation.isPending && <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
