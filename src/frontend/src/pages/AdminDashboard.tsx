import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { College, Review } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteReview,
  useGetAllColleges,
  useGetAllReviews,
  useGetFlaggedReviews,
  useHideReview,
  useIsAdmin,
  useUnhideReview,
} from "../hooks/useQueries";

function ReviewRow({
  review,
  index,
  colleges,
  onHide,
  onUnhide,
  onDelete,
}: {
  review: Review;
  index: number;
  colleges: College[];
  onHide: () => void;
  onUnhide: () => void;
  onDelete: () => void;
}) {
  const college = colleges.find((c) => c.id === review.collegeId);
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
      className="rounded-xl p-4 space-y-2"
      style={{
        background: "oklch(var(--card))",
        border: `1px solid ${
          review.isHidden
            ? "oklch(0.88 0.04 75)"
            : Number(review.reportCount) > 0
              ? "oklch(0.55 0.22 15 / 0.4)"
              : "oklch(var(--border))"
        }`,
        opacity: review.isHidden ? 0.65 : 1,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">
            {college?.name ?? `College #${review.collegeId}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {review.reviewerName || "Anonymous"} · {date}
          </p>
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
          <span className="text-sm font-medium">{avgRating.toFixed(1)} ⭐</span>
        </div>
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2">
        {review.feedbackText}
      </p>
      <div className="flex gap-2 pt-1">
        {review.isHidden ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onUnhide}
            data-ocid={`admin.hide_button.${index + 1}`}
            className="gap-1.5 text-xs"
          >
            <Eye className="h-3.5 w-3.5" /> Unhide
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={onHide}
            data-ocid={`admin.hide_button.${index + 1}`}
            className="gap-1.5 text-xs"
          >
            <EyeOff className="h-3.5 w-3.5" /> Hide
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              data-ocid={`admin.delete_button.${index + 1}`}
              className="gap-1.5 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Review Delete Karen?</AlertDialogTitle>
              <AlertDialogDescription>
                Yeh review permanently delete ho jaegi. Yeh kaam wapas nahi ho
                sakta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="admin.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                data-ocid="admin.confirm_button"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: allReviews, isLoading: allLoading } = useGetAllReviews();
  const { data: flaggedReviews, isLoading: flaggedLoading } =
    useGetFlaggedReviews();
  const { data: colleges } = useGetAllColleges();
  const hideReview = useHideReview();
  const unhideReview = useUnhideReview();
  const deleteReview = useDeleteReview();

  const handleHide = (idx: number) => {
    hideReview.mutate(BigInt(idx), {
      onSuccess: () => toast.success("Review hide ho gayi"),
      onError: () => toast.error("Error hiding review"),
    });
  };
  const handleUnhide = (idx: number) => {
    unhideReview.mutate(BigInt(idx), {
      onSuccess: () => toast.success("Review unhide ho gayi"),
      onError: () => toast.error("Error unhiding review"),
    });
  };
  const handleDelete = (idx: number) => {
    deleteReview.mutate(BigInt(idx), {
      onSuccess: () => toast.success("Review delete ho gayi"),
      onError: () => toast.error("Error deleting review"),
    });
  };

  if (!isLoggedIn) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShieldAlert
          className="mx-auto h-16 w-16 mb-4"
          style={{ color: "oklch(0.65 0.19 48)" }}
        />
        <h2 className="font-display text-2xl font-bold mb-2">
          Admin Login Required
        </h2>
        <p className="text-muted-foreground mb-6">
          Admin dashboard ke liye Internet Identity se login karein.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          size="lg"
        >
          {loginStatus === "logging-in" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login with Internet Identity
        </Button>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShieldAlert
          className="mx-auto h-16 w-16 mb-4"
          style={{ color: "oklch(0.55 0.22 15)" }}
        />
        <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          Aapke paas admin access nahi hai. / You do not have admin privileges.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Sabhi reviews manage karein
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.65 0.19 48)" }}
          >
            {allReviews?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Total Reviews</p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.55 0.22 15)" }}
          >
            {flaggedReviews?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Flagged Reviews</p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
        >
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.35 0.1 25)" }}
          >
            {allReviews?.filter((r) => r.isHidden).length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Hidden Reviews</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" data-ocid="admin.all_reviews.tab">
            All Reviews
          </TabsTrigger>
          <TabsTrigger value="flagged" data-ocid="admin.flagged_reviews.tab">
            Flagged{" "}
            {flaggedReviews &&
              flaggedReviews.length > 0 &&
              `(${flaggedReviews.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : !allReviews || allReviews.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              Abhi tak koi review nahi / No reviews yet
            </div>
          ) : (
            <div className="space-y-3">
              {allReviews.map((review, idx) => (
                <ReviewRow
                  key={`${review.ipHash}-${String(review.timestamp)}-${idx}`}
                  review={review}
                  index={idx}
                  colleges={colleges ?? []}
                  onHide={() => handleHide(idx)}
                  onUnhide={() => handleUnhide(idx)}
                  onDelete={() => handleDelete(idx)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flagged">
          {flaggedLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : !flaggedReviews || flaggedReviews.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              Koi flagged review nahi / No flagged reviews
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedReviews.map((review, idx) => (
                <ReviewRow
                  key={`${review.ipHash}-${String(review.timestamp)}-${idx}`}
                  review={review}
                  index={idx}
                  colleges={colleges ?? []}
                  onHide={() => handleHide(idx)}
                  onUnhide={() => handleUnhide(idx)}
                  onDelete={() => handleDelete(idx)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
