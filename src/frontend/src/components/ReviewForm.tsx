import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { College } from "../backend";
import { useSubmitReview } from "../hooks/useQueries";
import { getIpHash } from "../utils/ipHash";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  college: College;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const CATEGORIES = [
  {
    key: "teachingQuality",
    label: "Padhai / Teaching Quality",
    hint: "Teachers kaise hain?",
    ocid: "review.teaching_quality.input",
  },
  {
    key: "campusInfrastructure",
    label: "Campus / Campus Infrastructure",
    hint: "Ground, building aur safai",
    ocid: "review.campus_infrastructure.input",
  },
  {
    key: "placementJobs",
    label: "Placements / Placement & Jobs",
    hint: "Naukri milne ke chance",
    ocid: "review.placement_jobs.input",
  },
  {
    key: "libraryLabs",
    label: "Labs/Library",
    hint: "Books aur practical saman",
    ocid: "review.library_labs.input",
  },
  {
    key: "hostelFood",
    label: "Hostel/Food",
    hint: "Khana aur rehna kaisa hai",
    ocid: "review.hostel_food.input",
  },
  {
    key: "valueForMoney",
    label: "Paisa Vasool / Value for Money",
    hint: "Fees ke hisab se suvidha",
    ocid: "review.value_for_money.input",
  },
  {
    key: "extraCurricular",
    label: "Activities / Extracurricular",
    hint: "Khel-kood aur programs",
    ocid: "review.extracurricular.input",
  },
] as const;

type RatingKey = (typeof CATEGORIES)[number]["key"];
type Ratings = Record<RatingKey, number>;

const defaultRatings = (): Ratings => ({
  teachingQuality: 0,
  campusInfrastructure: 0,
  placementJobs: 0,
  libraryLabs: 0,
  hostelFood: 0,
  valueForMoney: 0,
  extraCurricular: 0,
});

export function ReviewForm({ college, open, onOpenChange }: ReviewFormProps) {
  const [ratings, setRatings] = useState<Ratings>(defaultRatings());
  const [feedback, setFeedback] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const submitReview = useSubmitReview(college.id);

  const reset = () => {
    setRatings(defaultRatings());
    setFeedback("");
    setReviewerName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = CATEGORIES.filter((c) => ratings[c.key] === 0);
    if (missing.length > 0) {
      toast.error(
        "Sabhi categories mein rating dein / Please rate all categories",
      );
      return;
    }
    if (feedback.trim().length < 20) {
      toast.error(
        "Apna anubhav kam se kam 20 akshar mein likhein / Feedback must be at least 20 characters",
      );
      return;
    }
    try {
      const ipHash = await getIpHash();
      await submitReview.mutateAsync({
        teachingQuality: ratings.teachingQuality,
        campusInfrastructure: ratings.campusInfrastructure,
        placementJobs: ratings.placementJobs,
        libraryLabs: ratings.libraryLabs,
        hostelFood: ratings.hostelFood,
        valueForMoney: ratings.valueForMoney,
        extraCurricular: ratings.extraCurricular,
        feedbackText: feedback.trim(),
        reviewerName: reviewerName.trim(),
        ipHash,
      });
      toast.success(
        "Aapki review submit ho gayi! / Review submitted successfully!",
      );
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("already") || msg.includes("duplicate")) {
        toast.error(
          "Aapne pehle se is college ki review di hai / Already reviewed this college",
        );
      } else {
        toast.error("Review submit nahi hui. Dobara try karein.");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Review Likhein / Write a Review
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {college.name}, {college.city}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="font-medium text-sm">{cat.label}</Label>
                <span className="text-xs text-muted-foreground">
                  {cat.hint}
                </span>
              </div>
              <div data-ocid={cat.ocid}>
                <StarRating
                  value={ratings[cat.key]}
                  onChange={(v) =>
                    setRatings((prev) => ({ ...prev, [cat.key]: v }))
                  }
                  size={28}
                />
              </div>
              {ratings[cat.key] === 0 && (
                <p className="text-xs text-muted-foreground">Click to rate</p>
              )}
            </div>
          ))}

          <div className="space-y-1.5">
            <Label htmlFor="feedback-text">
              Aapka Anubhav / Your Experience *
            </Label>
            <Textarea
              id="feedback-text"
              data-ocid="review.feedback.textarea"
              placeholder="Is college ke baare mein apna anubhav likhein (minimum 20 characters)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {feedback.length} chars
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reviewer-name">
              Aapka Naam / Your Name (optional)
            </Label>
            <Input
              id="reviewer-name"
              placeholder="Aapka naam (optional)"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              data-ocid="review.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitReview.isPending}
              data-ocid="review.submit_button"
            >
              {submitReview.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
