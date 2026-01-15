import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

type TutorItem = {
  id: number;
  bio: string | null;
  hourlyRate: string;
  verified: boolean;
  subjects: string[];
  user: { id: number; firstName: string; lastName: string; email: string };
};

export default function Landing() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("subject") ?? "");

  const { data } = useQuery({
    queryKey: ["tutors", search],
    queryFn: async () => {
      const res = await api.get("/api/tutors", { params: search ? { subject: search } : {} });
      return res.data as TutorItem[];
    },
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(search ? { subject: search } : {});
  };

  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-3xl font-bold mb-3">Find Tutors</h1>
        <form onSubmit={onSearch} className="max-w-md mx-auto flex gap-2">
          <input
            className="border rounded w-full p-2"
            placeholder="Search subject e.g. Math"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </form>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((t) => (
          <div key={t.id} className="border rounded p-4">
            <div className="font-semibold">
              {t.user.firstName} {t.user.lastName}
            </div>
            <div className="text-sm text-gray-600">{t.bio}</div>
            <div className="mt-2 text-sm">Subjects: {t.subjects.join(", ")}</div>
            <div className="mt-2">Hourly: ${t.hourlyRate}</div>
            <Link to={`/tutor/${t.user.id}`} className="text-blue-600 mt-3 inline-block">
              View Profile
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

