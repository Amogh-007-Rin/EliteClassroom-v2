import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

type Booking = {
  id: number;
  studentId: number;
  tutorId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
};

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await api.get("/api/bookings/me");
      return res.data as Booking[];
    },
  });
  const now = Date.now();
  const upcoming = (data ?? []).filter((b) => new Date(b.startTime).getTime() > now);
  const past = (data ?? []).filter((b) => new Date(b.endTime).getTime() <= now);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming Sessions</h2>
        <ul className="space-y-2">
          {upcoming.map((b) => (
            <li key={b.id} className="border rounded p-3">
              Tutor #{b.tutorId} • {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
          {upcoming.length === 0 && <p className="text-gray-600">No upcoming sessions</p>}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Past Sessions</h2>
        <ul className="space-y-2">
          {past.map((b) => (
            <li key={b.id} className="border rounded p-3">
              Tutor #{b.tutorId} • {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
          {past.length === 0 && <p className="text-gray-600">No past sessions</p>}
        </ul>
      </section>
    </div>
  );
}

