import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          See your upcoming and past tutoring sessions at a glance.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming sessions</CardTitle>
            <CardDescription>
              Sessions scheduled for the future.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {upcoming.map((b) => (
                <li
                  key={b.id}
                  className="rounded-lg border bg-card px-3 py-3 text-card-foreground shadow-sm"
                >
                  <div className="font-medium">
                    Tutor #{b.tutorId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(b.startTime).toLocaleString()} –{" "}
                    {new Date(b.endTime).toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {b.status}
                  </div>
                </li>
              ))}
              {upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No upcoming sessions yet. Book a tutor to get started.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Past sessions</CardTitle>
            <CardDescription>
              Sessions that have already finished.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {past.map((b) => (
                <li
                  key={b.id}
                  className="rounded-lg border bg-card px-3 py-3 text-card-foreground shadow-sm"
                >
                  <div className="font-medium">
                    Tutor #{b.tutorId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(b.startTime).toLocaleString()} –{" "}
                    {new Date(b.endTime).toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {b.status}
                  </div>
                </li>
              ))}
              {past.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No past sessions to show yet.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
