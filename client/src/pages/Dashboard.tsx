import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Dashboard() {
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data.user,
  });
  const { data: bookings } = useQuery({
    queryKey: ['bookings', me?.role],
    queryFn: async () => (await api.get('/bookings/me')).data.bookings,
    enabled: !!me,
  });
  const upcoming = (bookings ?? []).filter((b: any) => new Date(b.startTime) > new Date());
  const past = (bookings ?? []).filter((b: any) => new Date(b.startTime) <= new Date());
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      {!me ? <p>Loading...</p> : (
        <>
          <p className="text-sm">Welcome, {me.firstName}</p>
          {me.role === 'STUDENT' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Upcoming Sessions" items={upcoming} label="Tutor" accessor="tutor" />
              <Section title="Past Sessions" items={past} label="Tutor" accessor="tutor" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Upcoming Appointments" items={upcoming} label="Student" accessor="student" />
              <Section title="Payment Status" items={past} label="Student" accessor="student" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, items, label, accessor }: { title: string; items: any[]; label: string; accessor: 'tutor'|'student' }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-gray-600">None</p> : items.map((b) => (
          <div key={b.id} className="flex justify-between text-sm">
            <div>{label}: {b[accessor].firstName} {b[accessor].lastName}</div>
            <div>{new Date(b.startTime).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
