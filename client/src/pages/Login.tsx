import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type Form = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });
  async function onSubmit(values: Form) {
    await api.post('/auth/login', values);
    navigate('/dashboard');
  }
  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        <input className="border rounded px-3 py-2 w-full" placeholder="Password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={isSubmitting}>
          Login
        </button>
      </form>
      <p className="text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  );
}
