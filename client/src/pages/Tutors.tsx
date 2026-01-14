import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Tutors() {
  const [params] = useSearchParams();
  const subject = params.get('subject') ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['tutors', subject],
    queryFn: async () => {
      const res = await api.get('/tutors', { params: { subject } });
      return res.data as Array<any>;
    },
  });
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Tutors</h2>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((t) => (
            <div key={t.id} className="border rounded p-4 space-y-2">
              <div className="font-medium">{t.firstName} {t.lastName}</div>
              <div>{t.bio}</div>
              <div className="text-sm">Subjects: {t.subjects.join(', ')}</div>
              <div className="text-sm">Rate: ${t.hourlyRate}</div>
              <Link className="text-blue-600 underline" to={`/tutor/${t.userId}`}>View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
