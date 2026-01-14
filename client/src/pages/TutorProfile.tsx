import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useState } from 'react';

export default function TutorProfile() {
  const { id } = useParams();
  const tutorUserId = Number(id);
  const { data } = useQuery({
    queryKey: ['tutor', tutorUserId],
    queryFn: async () => {
      const res = await api.get('/tutors', { params: { } });
      const list = res.data as any[];
      const item = list.find((t) => t.userId === tutorUserId);
      return item;
    },
  });
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const createBooking = useMutation({
    mutationFn: async () => {
      return api.post('/bookings', { tutorId: tutorUserId, startTime: start, endTime: end });
    },
  });
  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      {!data ? <p>Loading...</p> : (
        <>
          <h2 className="text-2xl font-semibold">{data.firstName} {data.lastName}</h2>
          <p>{data.bio}</p>
          <div>Subjects: {data.subjects.join(', ')}</div>
          <div>Rate: ${data.hourlyRate}</div>
          <div className="space-y-2">
            <h3 className="font-medium">Book a session</h3>
            <input className="border rounded px-3 py-2 w-full" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => createBooking.mutate()}
              disabled={createBooking.isPending}
            >
              Book
            </button>
            {createBooking.isError && <p className="text-red-600 text-sm">Failed to book</p>}
            {createBooking.isSuccess && <p className="text-green-600 text-sm">Booking created</p>}
          </div>
        </>
      )}
    </div>
  );
}
