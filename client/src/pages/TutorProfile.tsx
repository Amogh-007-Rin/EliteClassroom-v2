import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading tutor profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>
              {tutor.user.firstName} {tutor.user.lastName}
            </span>
            {tutor.verified && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                Verified tutor
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {tutor.subjects.length > 0
              ? `Teaches ${tutor.subjects.join(", ")}`
              : "Subjects not listed yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            {tutor.bio || "This tutor has not added a detailed bio yet."}
          </p>
          <p>
            <span className="font-medium">${tutor.hourlyRate}</span> per hour
          </p>
          <p className="text-xs text-muted-foreground">
            Contact: {tutor.user.email}
          </p>
        </CardContent>
      </Card>

      <Card>
        <form onSubmit={book} className="space-y-4">
          <CardHeader className="space-y-1">
            <CardTitle>Book a session</CardTitle>
            <CardDescription>
              Choose a start and end time that works for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Start time</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">End time</label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Book session</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
