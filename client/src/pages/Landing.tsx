import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
    <div className="space-y-10">
      <section className="pb-8 pt-10 text-center">
        <p className="mx-auto mb-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Smart matching for students and tutors
        </p>
        <h1 className="mx-auto mb-3 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Find the right tutor for every subject
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Browse verified tutors, compare rates, and book live one-to-one sessions
          that fit your schedule.
        </p>
        <form
          onSubmit={onSearch}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            placeholder="Search subject e.g. Math, Physics, English"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="w-full sm:w-auto">
            Search
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Featured tutors</h2>
          <span className="text-xs text-muted-foreground sm:text-sm">
            {data
              ? `${data.length} tutor${data.length === 1 ? "" : "s"} available`
              : "Loading tutors..."}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((t) => (
            <Card key={t.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <span>
                    {t.user.firstName} {t.user.lastName}
                  </span>
                  {t.verified && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Verified
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {t.bio || "This tutor has not added a bio yet."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Subjects:{" "}
                  <span className="font-medium text-foreground">
                    {t.subjects.join(", ")}
                  </span>
                </p>
                <p className="font-medium">${t.hourlyRate} / hour</p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {t.subjects[0] ? `Great for ${t.subjects[0]}` : ""}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/tutor/${t.user.id}`}>View profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tutors found. Try searching for a different subject.
          </p>
        )}
      </section>
    </div>
  );
}
