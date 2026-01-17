import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { register, handleSubmit, formState: { } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/login', data);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl shadow-xl mb-4">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative group">
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" 
                />
                <Mail className="absolute left-4 top-4.5 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
              </div>
              
              <div className="relative group">
                <input 
                  {...register('password')} 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" 
                />
                <Lock className="absolute left-4 top-4.5 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-bold">
              <label className="flex items-center text-gray-500 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-bold">
              New to EliteClassroom? 
              <Link to="/register" className="text-blue-600 ml-1 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
