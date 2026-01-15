import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TUTOR"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await api.post("/api/auth/register", values);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select className="border rounded w-full p-2" {...register("role")}>
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">First name</label>
            <input className="border rounded w-full p-2" {...register("firstName")} />
            {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Last name</label>
            <input className="border rounded w-full p-2" {...register("lastName")} />
            {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="border rounded w-full p-2" type="email" {...register("email")} />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input className="border rounded w-full p-2" type="password" {...register("password")} />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>Create account</button>
      </form>
    </div>
  );
}

