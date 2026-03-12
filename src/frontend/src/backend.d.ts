import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface College {
    id: bigint;
    city: string;
    name: string;
    collegeType: string;
    affiliation: string;
}
export interface AggregateStats {
    avgCampusInfrastructure: number;
    avgPlacementJobs: number;
    avgValueForMoney: number;
    avgHostelFood: number;
    collegeId: bigint;
    avgExtraCurricular: number;
    totalReviews: bigint;
    avgLibraryLabs: number;
    avgTeachingQuality: number;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Review {
    reportCount: bigint;
    teachingQuality: bigint;
    feedbackText: string;
    placementJobs: bigint;
    reviewerName: string;
    valueForMoney: bigint;
    collegeId: bigint;
    isHidden: boolean;
    timestamp: Time;
    ipHash: string;
    libraryLabs: bigint;
    extraCurricular: bigint;
    campusInfrastructure: bigint;
    hostelFood: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollege(name: string, city: string, collegeType: string, affiliation: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteReview(reviewId: bigint): Promise<void>;
    getAggregateStats(collegeId: bigint): Promise<AggregateStats | null>;
    getAllColleges(): Promise<Array<College>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFlaggedReviews(): Promise<Array<Review>>;
    getReviewsByCollege(collegeId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hideReview(reviewId: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    reportReview(reviewId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCollegesByName(input: string): Promise<Array<College>>;
    submitReview(collegeId: bigint, teachingQuality: bigint, campusInfrastructure: bigint, placementJobs: bigint, libraryLabs: bigint, hostelFood: bigint, valueForMoney: bigint, extraCurricular: bigint, feedbackText: string, reviewerName: string, ipHash: string): Promise<void>;
    unhideReview(reviewId: bigint): Promise<void>;
}
