import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useState } from "react";

type TutorItem = {
  id: number;
  bio: string | null;
  hourlyRate: string;
  verified: boolean;
  subjects: string[];
  user: { id: number; firstName: string; lastName: string; email: string };
};

export default function TutorProfile() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const res = await api.get("/api/tutors");
      return res.data as TutorItem[];
    },
  });
  const tutor = (data ?? []).find((t) => String(t.user.id) === id);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await api.post("/api/bookings", { tutorId: Number(id), startTime, endTime });
    alert("Booked!");
  };

  if (!tutor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">
        {tutor.user.firstName} {tutor.user.lastName}
      </h1>
      <p className="text-gray-700 mt-2">{tutor.bio}</p>
      <p className="mt-2">Hourly Rate: ${tutor.hourlyRate}</p>
      <p className="mt-2">Subjects: {tutor.subjects.join(", ")}</p>

      <form onSubmit={book} className="mt-6 space-y-3">
        <div>
          <label className="block text-sm font-medium">Start time</label>
          <input className="border rounded w-full p-2" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">End time</label>
          <input className="border rounded w-full p-2" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Book</button>
      </form>
    </div>
  );
}

