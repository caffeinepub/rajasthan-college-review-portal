import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          aria-label={`${star} star`}
          style={{ cursor: readonly ? "default" : "pointer" }}
        >
          <Star
            size={size}
            fill={star <= value ? "oklch(0.65 0.19 48)" : "transparent"}
            stroke={
              star <= value ? "oklch(0.65 0.19 48)" : "oklch(0.6 0.06 60)"
            }
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

interface DisplayRatingProps {
  value: number;
  size?: number;
}

export function DisplayRating({ value, size = 16 }: DisplayRatingProps) {
  return <StarRating value={Math.round(value)} readonly size={size} />;
}
