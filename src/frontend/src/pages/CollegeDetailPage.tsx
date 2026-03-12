import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Flag, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { College, Review } from "../backend";
import { ReviewForm } from "../components/ReviewForm";
import { DisplayRating } from "../components/StarRating";
import {
  useGetAggregateStats,
  useGetReviewsByCollege,
  useReportReview,
} from "../hooks/useQueries";

interface CollegeDetailPageProps {
  college: College;
  onBack: () => void;
}

const CATEGORY_LABELS = [
  { key: "avgTeachingQuality" as const, label: "Padhai / Teaching Quality" },
  { key: "avgCampusInfrastructure" as const, label: "Campus / Infrastructure" },
  { key: "avgPlacementJobs" as const, label: "Placements / Jobs" },
  { key: "avgLibraryLabs" as const, label: "Labs/Library" },
  { key: "avgHostelFood" as const, label: "Hostel/Food" },
  { key: "avgValueForMoney" as const, label: "Paisa Vasool / Value" },
  { key: "avgExtraCurricular" as const, label: "Activities / Extracurricular" },
];

function ReviewCard({
  review,
  index,
  onReport,
}: { review: Review; index: number; onReport: () => void }) {
  const [reported, setReported] = useState(false);
  const date = new Date(
    Number(review.timestamp / 1_000_000n),
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const avgRating =
    (Number(review.teachingQuality) +
      Number(review.campusInfrastructure) +
      Number(review.placementJobs) +
      Number(review.libraryLabs) +
      Number(review.hostelFood) +
      Number(review.valueForMoney) +
      Number(review.extraCurricular)) /
    7;

  return (
    <div
      className="rounded-xl p-5 space-y-4 animate-fade-up"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        opacity: review.isHidden ? 0.5 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "oklch(0.65 0.19 48 / 0.15)",
              color: "oklch(0.55 0.18 48)",
            }}
          >
            {(review.reviewerName || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">
              {review.reviewerName || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {review.isHidden && (
            <Badge variant="secondary" className="text-xs">
              Hidden
            </Badge>
          )}
          {Number(review.reportCount) > 0 && (
            <Badge variant="destructive" className="text-xs">
              {Number(review.reportCount)} reports
            </Badge>
          )}
          <DisplayRating value={avgRating} size={14} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { label: "Teaching", val: review.teachingQuality },
          { label: "Campus", val: review.campusInfrastructure },
          { label: "Placements", val: review.placementJobs },
          { label: "Labs", val: review.libraryLabs },
          { label: "Hostel", val: review.hostelFood },
          { label: "Value", val: review.valueForMoney },
          { label: "Activities", val: review.extraCurricular },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className="text-muted-foreground">{item.label}:</span>
            <Star
              className="h-3 w-3"
              fill="oklch(0.65 0.19 48)"
              stroke="oklch(0.65 0.19 48)"
            />
            <span className="font-medium">{Number(item.val)}</span>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-foreground/90">
        {review.feedbackText}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <button
          type="button"
          data-ocid={`review.report_button.${index + 1}`}
          onClick={() => {
            if (!reported) {
              onReport();
              setReported(true);
            }
          }}
          disabled={reported}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: reported
              ? "oklch(0.88 0.04 75)"
              : "oklch(0.55 0.22 15 / 0.08)",
            color: reported ? "oklch(0.5 0.04 40)" : "oklch(0.55 0.22 15)",
          }}
        >
          <Flag className="h-3 w-3" />
          {reported ? "Reported" : "Report"}
        </button>
      </div>
    </div>
  );
}

export function CollegeDetailPage({ college, onBack }: CollegeDetailPageProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsByCollege(
    college.id,
  );
  const { data: stats, isLoading: statsLoading } = useGetAggregateStats(
    college.id,
  );
  const reportReview = useReportReview();

  const visibleReviews = reviews?.filter((r) => !r.isHidden) ?? [];

  const overallAvg = stats
    ? (stats.avgTeachingQuality +
        stats.avgCampusInfrastructure +
        stats.avgPlacementJobs +
        stats.avgLibraryLabs +
        stats.avgHostelFood +
        stats.avgValueForMoney +
        stats.avgExtraCurricular) /
      7
    : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.1 25), oklch(0.45 0.12 30))",
          boxShadow: "0 8px 32px oklch(0.35 0.1 25 / 0.3)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge
              className="mb-2 text-xs"
              style={{
                background: "oklch(0.65 0.19 48 / 0.3)",
                color: "oklch(0.92 0.08 80)",
              }}
            >
              {college.collegeType}
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {college.name}
            </h2>
            <p className="text-white/70 mt-1 text-sm">
              {college.city} · {college.affiliation}
            </p>
          </div>
          {stats && (
            <div className="text-center">
              <p
                className="text-4xl font-bold font-display"
                style={{ color: "oklch(0.78 0.17 85)" }}
              >
                {overallAvg.toFixed(1)}
              </p>
              <DisplayRating value={overallAvg} size={18} />
              <p className="text-white/60 text-xs mt-1">
                {Number(stats.totalReviews)} reviews
              </p>
            </div>
          )}
        </div>
      </div>

      {statsLoading ? (
        <Skeleton className="h-56 rounded-xl mb-6" />
      ) : stats ? (
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <h3 className="font-display font-semibold text-lg mb-4">
            Overall Ratings · समग्र रेटिंग
          </h3>
          <div className="space-y-3">
            {CATEGORY_LABELS.map((cat) => {
              const val = stats[cat.key];
              return (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="text-sm w-44 flex-shrink-0 text-muted-foreground">
                    {cat.label}
                  </span>
                  <div className="flex-1 rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${(val / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">
                    {val.toFixed(1)}
                  </span>
                  <div className="w-20 flex-shrink-0">
                    <DisplayRating value={val} size={12} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {Number(stats.totalReviews)} total reviews
            </span>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-6 mb-6 text-center"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <p className="text-muted-foreground text-sm">
            Abhi tak koi review nahi · No reviews yet
          </p>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <Button
          data-ocid="college.review_button"
          onClick={() => setReviewOpen(true)}
          size="lg"
          className="gap-2 px-8"
        >
          <Star className="h-4 w-4" /> Review Likhein / Write a Review
        </Button>
      </div>

      <div>
        <h3 className="font-display font-semibold text-xl mb-4">
          Student Reviews · छात्र समीक्षाएं
          {visibleReviews.length > 0 && (
            <span className="text-base font-normal text-muted-foreground ml-2">
              ({visibleReviews.length})
            </span>
          )}
        </h3>

        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : visibleReviews.length === 0 ? (
          <div
            className="text-center py-12 rounded-xl"
            data-ocid="college.empty_state"
            style={{
              background: "oklch(var(--muted) / 0.4)",
              border: "1px dashed oklch(var(--border))",
            }}
          >
            <Star
              className="mx-auto h-10 w-10 mb-3"
              style={{ color: "oklch(0.65 0.19 48 / 0.4)" }}
            />
            <p className="font-semibold">Pehle Review Dene Ka Mauka Aapka!</p>
            <p className="text-muted-foreground text-sm mt-1">
              Be the first to review this college
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map((review, idx) => (
              <ReviewCard
                key={`${review.ipHash}-${String(review.timestamp)}`}
                review={review}
                index={idx}
                onReport={() => {
                  reportReview.mutate(BigInt(idx), {
                    onSuccess: () =>
                      toast.success("Review report ho gayi / Review reported"),
                    onError: () => toast.error("Report nahi hua. Try again."),
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ReviewForm
        college={college}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />
    </main>
  );
}
