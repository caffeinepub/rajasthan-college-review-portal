import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AggregateStats, College, Review } from "../backend";
import { useActor } from "./useActor";

export function useGetAllColleges() {
  const { actor, isFetching } = useActor();
  return useQuery<College[]>({
    queryKey: ["colleges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllColleges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchColleges(input: string) {
  const { actor, isFetching } = useActor();
  return useQuery<College[]>({
    queryKey: ["colleges", "search", input],
    queryFn: async () => {
      if (!actor) return [];
      if (!input.trim()) return actor.getAllColleges();
      return actor.searchCollegesByName(input);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReviewsByCollege(collegeId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", collegeId?.toString()],
    queryFn: async () => {
      if (!actor || collegeId === null) return [];
      return actor.getReviewsByCollege(collegeId);
    },
    enabled: !!actor && !isFetching && collegeId !== null,
  });
}

export function useGetAggregateStats(collegeId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<AggregateStats | null>({
    queryKey: ["stats", collegeId?.toString()],
    queryFn: async () => {
      if (!actor || collegeId === null) return null;
      return actor.getAggregateStats(collegeId);
    },
    enabled: !!actor && !isFetching && collegeId !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["allReviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFlaggedReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["flaggedReviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFlaggedReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCollege() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      city: string;
      collegeType: string;
      affiliation: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCollege(
        data.name,
        data.city,
        data.collegeType,
        data.affiliation,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colleges"] });
    },
  });
}

export function useSubmitReview(collegeId: bigint | null) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      teachingQuality: number;
      campusInfrastructure: number;
      placementJobs: number;
      libraryLabs: number;
      hostelFood: number;
      valueForMoney: number;
      extraCurricular: number;
      feedbackText: string;
      reviewerName: string;
      ipHash: string;
    }) => {
      if (!actor || collegeId === null) throw new Error("Not ready");
      return actor.submitReview(
        collegeId,
        BigInt(data.teachingQuality),
        BigInt(data.campusInfrastructure),
        BigInt(data.placementJobs),
        BigInt(data.libraryLabs),
        BigInt(data.hostelFood),
        BigInt(data.valueForMoney),
        BigInt(data.extraCurricular),
        data.feedbackText,
        data.reviewerName,
        data.ipHash,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", collegeId?.toString()] });
      qc.invalidateQueries({ queryKey: ["stats", collegeId?.toString()] });
    },
  });
}

export function useReportReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.reportReview(reviewId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["allReviews"] });
      qc.invalidateQueries({ queryKey: ["flaggedReviews"] });
    },
  });
}

export function useHideReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.hideReview(reviewId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allReviews"] });
      qc.invalidateQueries({ queryKey: ["flaggedReviews"] });
    },
  });
}

export function useUnhideReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unhideReview(reviewId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allReviews"] });
      qc.invalidateQueries({ queryKey: ["flaggedReviews"] });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteReview(reviewId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allReviews"] });
      qc.invalidateQueries({ queryKey: ["flaggedReviews"] });
    },
  });
}
