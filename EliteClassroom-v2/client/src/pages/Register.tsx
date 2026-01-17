import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { User, Mail, Lock, GraduationCap, Users, ArrowRight, BookOpen } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  role: z.enum(['STUDENT', 'TUTOR']),
});

export default function Register() {
  const { register, handleSubmit, watch, formState: { } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' }
  });
  const navigate = useNavigate();
  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/register', data);
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Email might already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl shadow-xl mb-4">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Join EliteClassroom</h2>
          <p className="text-gray-500 font-medium">The journey to mastery begins here.</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Switcher */}
            <div className="bg-gray-50 p-2 rounded-2xl flex gap-2">
              <label className={`flex-1 flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all font-bold ${selectedRole === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                <input {...register('role')} type="radio" value="STUDENT" className="sr-only" />
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Student</span>
              </label>
              <label className={`flex-1 flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all font-bold ${selectedRole === 'TUTOR' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                <input {...register('role')} type="radio" value="TUTOR" className="sr-only" />
                <Users className="w-5 h-5 mr-2" />
                <span>Tutor</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input {...register('firstName')} placeholder="First Name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" />
                <User className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
              </div>
              <div className="relative group">
                <input {...register('lastName')} placeholder="Last Name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" />
                <User className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="relative group">
              <input {...register('email')} type="email" placeholder="Email address" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" />
              <Mail className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
            </div>

            <div className="relative group">
              <input {...register('password')} type="password" placeholder="Choose a password" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" />
              <Lock className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
            </div>

            <p className="text-xs text-gray-400 font-medium text-center px-4">
              By creating an account, you agree to our <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-bold">
              Already have an account? 
              <Link to="/login" className="text-blue-600 ml-1 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
