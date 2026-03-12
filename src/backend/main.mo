import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type College = {
    id : Nat;
    name : Text;
    city : Text;
    collegeType : Text;
    affiliation : Text;
  };

  type Review = {
    collegeId : Nat;
    teachingQuality : Nat;
    campusInfrastructure : Nat;
    placementJobs : Nat;
    libraryLabs : Nat;
    hostelFood : Nat;
    valueForMoney : Nat;
    extraCurricular : Nat;
    feedbackText : Text;
    reviewerName : Text;
    ipHash : Text;
    timestamp : Time.Time;
    isHidden : Bool;
    reportCount : Nat;
  };

  type AggregateStats = {
    collegeId : Nat;
    avgTeachingQuality : Float;
    avgCampusInfrastructure : Float;
    avgPlacementJobs : Float;
    avgLibraryLabs : Float;
    avgHostelFood : Float;
    avgValueForMoney : Float;
    avgExtraCurricular : Float;
    totalReviews : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let colleges = Map.empty<Nat, College>();
  let reviews = Map.empty<Nat, Review>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextCollegeId = 1;
  var nextReviewId = 1;

  // Pre-seed 20 Rajasthan colleges
  func seedColleges() {
    let preSeeded = [
      ("IIT Jodhpur", "Jodhpur", "Public", "IIT"),
      ("MNIT Jaipur", "Jaipur", "NIT", "NIT"),
      ("BITS Pilani", "Pilani", "Private", "BITS"),
      ("SMS Medical College", "Jaipur", "Government", "RMC"),
      ("Rajasthan University", "Jaipur", "Government", "State University"),
      ("LNMIIT", "Jaipur", "Private", "Private University"),
      ("Govt. Engineering College", "Ajmer", "Government", "RTU"),
      ("MSMSV", "Udaipur", "Government", "State University"),
      ("JVVNL", "Jodhpur", "Government", "State"),
      ("SKN Agriculture University", "Jobner", "Government", "Agricultural"),
      ("RTU Kota", "Kota", "Government", "Technical University"),
      ("Brahma Kumaris Engineering", "Mount Abu", "Private", "Private"),
      ("Mahatma Jyoti Science College", "Jaipur", "Private", "Private"),
      ("Arya College", "Jaipur", "Private", "Private"),
      ("Govt. Medical College", "Kota", "Government", "RMC"),
      ("Birla Institute", "Bhilwara", "Private", "Private University"),
      ("Sukhadia University", "Udaipur", "Government", "State University"),
      ("Govt. Law College", "Alwar", "Government", "State"),
      ("Sardar Patel Medical", "Bikaner", "Government", "RMC"),
      ("JECRC", "Jaipur", "Private", "Private University"),
    ];

    for ((name, city, collegeType, affiliation) in preSeeded.vals()) {
      let college : College = {
        id = nextCollegeId;
        name;
        city;
        collegeType;
        affiliation;
      };
      colleges.add(nextCollegeId, college);
      nextCollegeId += 1;
    };
  };

  // Seed colleges on deployment
  seedColleges();

  // User Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // College functions
  public shared ({ caller }) func addCollege(name : Text, city : Text, collegeType : Text, affiliation : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add colleges");
    };
    let college : College = {
      id = nextCollegeId;
      name;
      city;
      collegeType;
      affiliation;
    };
    colleges.add(nextCollegeId, college);
    nextCollegeId += 1;
  };

  public query ({ caller }) func getAllColleges() : async [College] {
    colleges.values().toArray();
  };

  public query ({ caller }) func searchCollegesByName(input : Text) : async [College] {
    let results = List.empty<College>();
    for (c in colleges.values()) {
      if (c.name.contains(#text input)) {
        results.add(c);
      };
    };
    results.reverse().toArray();
  };

  // Review functions
  public shared ({ caller }) func submitReview(
    collegeId : Nat,
    teachingQuality : Nat,
    campusInfrastructure : Nat,
    placementJobs : Nat,
    libraryLabs : Nat,
    hostelFood : Nat,
    valueForMoney : Nat,
    extraCurricular : Nat,
    feedbackText : Text,
    reviewerName : Text,
    ipHash : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit reviews");
    };

    // Check for duplicate review from same IP
    for (r in reviews.values()) {
      if (r.collegeId == collegeId and r.ipHash == ipHash) {
        Runtime.trap("Duplicate review from same IP for this college");
      };
    };

    let review : Review = {
      collegeId;
      teachingQuality;
      campusInfrastructure;
      placementJobs;
      libraryLabs;
      hostelFood;
      valueForMoney;
      extraCurricular;
      feedbackText;
      reviewerName;
      ipHash;
      timestamp = Time.now();
      isHidden = false;
      reportCount = 0;
    };

    reviews.add(nextReviewId, review);
    nextReviewId += 1;
  };

  public query ({ caller }) func getReviewsByCollege(collegeId : Nat) : async [Review] {
    let filtered = reviews.values().toArray().filter(
      func(r : Review) : Bool {
        r.collegeId == collegeId and not r.isHidden
      }
    );
    filtered;
  };

  public shared ({ caller }) func reportReview(reviewId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report reviews");
    };

    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?review) {
        let updated = {
          review with
          reportCount = review.reportCount + 1;
          isHidden = review.reportCount + 1 >= 3;
        };
        reviews.add(reviewId, updated);
      };
    };
  };

  public query ({ caller }) func getAggregateStats(collegeId : Nat) : async ?AggregateStats {
    let collegeReviews = reviews.values().toArray().filter(
      func(r : Review) : Bool {
        r.collegeId == collegeId and not r.isHidden
      }
    );

    let count = collegeReviews.size();
    if (count == 0) {
      return null;
    };

    var sumTeaching : Nat = 0;
    var sumCampus : Nat = 0;
    var sumPlacement : Nat = 0;
    var sumLibrary : Nat = 0;
    var sumHostel : Nat = 0;
    var sumValue : Nat = 0;
    var sumExtra : Nat = 0;

    for (r in collegeReviews.vals()) {
      sumTeaching += r.teachingQuality;
      sumCampus += r.campusInfrastructure;
      sumPlacement += r.placementJobs;
      sumLibrary += r.libraryLabs;
      sumHostel += r.hostelFood;
      sumValue += r.valueForMoney;
      sumExtra += r.extraCurricular;
    };

    let countFloat = count.toFloat();

    ?{
      collegeId;
      avgTeachingQuality = sumTeaching.toFloat() / countFloat;
      avgCampusInfrastructure = sumCampus.toFloat() / countFloat;
      avgPlacementJobs = sumPlacement.toFloat() / countFloat;
      avgLibraryLabs = sumLibrary.toFloat() / countFloat;
      avgHostelFood = sumHostel.toFloat() / countFloat;
      avgValueForMoney = sumValue.toFloat() / countFloat;
      avgExtraCurricular = sumExtra.toFloat() / countFloat;
      totalReviews = count;
    };
  };

  // Admin functions
  public query ({ caller }) func getAllReviews() : async [Review] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    reviews.values().toArray();
  };

  public shared ({ caller }) func hideReview(reviewId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?review) {
        let updated = { review with isHidden = true };
        reviews.add(reviewId, updated);
      };
    };
  };

  public shared ({ caller }) func unhideReview(reviewId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?review) {
        let updated = { review with isHidden = false };
        reviews.add(reviewId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteReview(reviewId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    reviews.remove(reviewId);
  };

  public query ({ caller }) func getFlaggedReviews() : async [Review] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let filtered = reviews.values().toArray().filter(
      func(r : Review) : Bool { r.reportCount >= 3 }
    );
    filtered;
  };
};
