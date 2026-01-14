import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">EliteClassroom</h1>
        <p className="text-muted-foreground">Find tutors and book sessions</p>
        <div className="flex gap-2 justify-center">
          <input
            className="border rounded px-3 py-2 w-64"
            placeholder="Search subject (e.g., Math)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate(`/tutors?subject=${encodeURIComponent(subject)}`)}
          >
            Find Tutors
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          <Link className="underline" to="/login">Login</Link>
          <Link className="underline" to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
