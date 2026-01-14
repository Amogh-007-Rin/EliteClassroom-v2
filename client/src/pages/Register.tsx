import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'TUTOR']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
type Form = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' }
  });
  async function onSubmit(values: Form) {
    await api.post('/auth/register', values);
    navigate('/dashboard');
  }
  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <select className="border rounded px-3 py-2 w-full" {...register('role')}>
          <option value="STUDENT">Student</option>
          <option value="TUTOR">Tutor</option>
        </select>
        <input className="border rounded px-3 py-2 w-full" placeholder="First name" {...register('firstName')} />
        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
        <input className="border rounded px-3 py-2 w-full" placeholder="Last name" {...register('lastName')} />
        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        <input className="border rounded px-3 py-2 w-full" placeholder="Password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={isSubmitting}>
          Create Account
        </button>
      </form>
      <p className="text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  );
}
