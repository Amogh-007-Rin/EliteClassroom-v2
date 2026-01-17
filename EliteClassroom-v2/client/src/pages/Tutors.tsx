import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Search, Filter, Star, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function Tutors() {
  const [subject, setSubject] = useState('');
  const { data: tutors, isLoading } = useQuery({
    queryKey: ['tutors', subject],
    queryFn: async () => {
      const res = await api.get('/tutors' + (subject ? `?subject=${subject}` : ''));
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Expert Tutors</h1>
          <p className="text-xl text-gray-500 max-w-2xl mb-8">
            Filter through our network of verified professionals to find your perfect learning partner.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="What subject do you need help with?" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Search className="absolute left-4 top-4.5 text-gray-400 w-6 h-6" />
            </div>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-800 transition">
              <Filter className="w-5 h-5 mr-2" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">Finding experts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors?.map((tutor: any) => (
              <div key={tutor.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-black">
                        {tutor.user.firstName[0]}{tutor.user.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition">
                          {tutor.user.firstName} {tutor.user.lastName}
                        </h3>
                        <div className="flex items-center text-yellow-500 mt-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold ml-1 text-gray-900">4.9</span>
                          <span className="text-xs text-gray-400 font-medium ml-1">(120 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">${tutor.hourlyRate}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Per Hour</p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 font-medium italic">
                    "{tutor.bio}"
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {tutor.subjects?.map((s: any) => (
                      <span key={s.subject?.id || Math.random()} className="bg-gray-50 text-gray-600 text-sm px-3 py-1.5 rounded-xl border border-gray-100 font-bold">
                        {s.subject?.name || 'Subject'}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-50">
                    <div className="flex items-center text-gray-500 text-sm font-bold">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>450+ Hours</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm font-bold">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Remote</span>
                    </div>
                  </div>

                  <Link 
                    to={`/tutor/${tutor.id}`} 
                    className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 group-hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
