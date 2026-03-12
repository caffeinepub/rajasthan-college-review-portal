import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Building2,
  ChevronRight,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { College } from "../backend";
import { AddCollegeDialog } from "../components/AddCollegeDialog";
import { useSearchColleges } from "../hooks/useQueries";

interface HomePageProps {
  onSelectCollege: (college: College) => void;
}

const SAMPLE_COLLEGES: College[] = [
  {
    id: 1n,
    name: "Malaviya National Institute of Technology",
    city: "Jaipur",
    collegeType: "Engineering",
    affiliation: "NIT (Autonomous)",
  },
  {
    id: 2n,
    name: "University of Rajasthan",
    city: "Jaipur",
    collegeType: "Arts",
    affiliation: "RU",
  },
  {
    id: 3n,
    name: "Rajasthan Technical University",
    city: "Kota",
    collegeType: "Engineering",
    affiliation: "RTU",
  },
  {
    id: 4n,
    name: "Mohanlal Sukhadia University",
    city: "Udaipur",
    collegeType: "Science",
    affiliation: "MLSU",
  },
  {
    id: 5n,
    name: "Jai Narain Vyas University",
    city: "Jodhpur",
    collegeType: "Arts",
    affiliation: "JNVU",
  },
  {
    id: 6n,
    name: "Banasthali Vidyapith",
    city: "Newai",
    collegeType: "Engineering",
    affiliation: "Autonomous",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Engineering: "bg-blue-100 text-blue-800",
  Medical: "bg-red-100 text-red-800",
  Arts: "bg-purple-100 text-purple-800",
  Science: "bg-green-100 text-green-800",
  Commerce: "bg-yellow-100 text-yellow-800",
  Management: "bg-orange-100 text-orange-800",
  Law: "bg-indigo-100 text-indigo-800",
  Education: "bg-teal-100 text-teal-800",
};

export function HomePage({ onSelectCollege }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: colleges, isLoading } = useSearchColleges(debouncedQuery);
  const displayColleges =
    colleges && colleges.length > 0
      ? colleges
      : !isLoading && !debouncedQuery
        ? SAMPLE_COLLEGES
        : (colleges ?? []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="home.search_input"
            className="pl-10 h-11"
            placeholder="College ka naam search karein... (e.g. RTU, Jaipur)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button
          data-ocid="home.add_college_button"
          onClick={() => setAddOpen(true)}
          className="h-11 gap-2 whitespace-nowrap"
          style={{ background: "oklch(0.35 0.1 25)", color: "white" }}
        >
          <Plus className="h-4 w-4" />
          Naya College Joḍen
        </Button>
      </div>

      <div
        className="mb-6 p-4 rounded-xl flex gap-6 flex-wrap"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.1 25 / 0.08), oklch(0.65 0.19 48 / 0.08))",
          border: "1px solid oklch(0.65 0.19 48 / 0.2)",
        }}
      >
        <div className="text-center">
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.65 0.19 48)" }}
          >
            {displayColleges.length}+
          </p>
          <p className="text-xs text-muted-foreground">Colleges Listed</p>
        </div>
        <div className="text-center">
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.35 0.1 25)" }}
          >
            7
          </p>
          <p className="text-xs text-muted-foreground">Rating Categories</p>
        </div>
        <div className="text-center">
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.78 0.17 85)" }}
          >
            Free
          </p>
          <p className="text-xs text-muted-foreground">No Login Required</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : displayColleges.length === 0 ? (
        <div className="text-center py-16" data-ocid="college.empty_state">
          <Building2
            className="mx-auto h-12 w-12 mb-3"
            style={{ color: "oklch(0.65 0.19 48 / 0.5)" }}
          />
          <h3 className="font-display text-lg font-semibold mb-1">
            Koi College Nahi Mila
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            No college found for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            variant="outline"
            data-ocid="home.add_college_button"
          >
            <Plus className="mr-2 h-4 w-4" /> Add This College
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayColleges.map((college, idx) => (
            <button
              type="button"
              key={college.id.toString()}
              data-ocid={`college.item.${idx + 1}`}
              className="rounded-xl p-5 cursor-pointer group transition-all duration-200 hover:-translate-y-1 text-left w-full"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                boxShadow: "0 2px 12px oklch(0.22 0.04 35 / 0.06)",
              }}
              onClick={() => onSelectCollege(college)}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    TYPE_COLORS[college.collegeType] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {college.collegeType}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-base leading-snug mb-2 line-clamp-2">
                {college.name}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{college.city}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <BookOpen className="h-3 w-3" />
                <span>{college.affiliation}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <span
                  className="block w-full text-sm font-medium py-1.5 rounded-lg text-center transition-colors"
                  style={{
                    background: "oklch(0.65 0.19 48 / 0.12)",
                    color: "oklch(0.55 0.18 48)",
                  }}
                >
                  Reviews Dekhen / Rate College
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <AddCollegeDialog open={addOpen} onOpenChange={setAddOpen} />
    </main>
  );
}
