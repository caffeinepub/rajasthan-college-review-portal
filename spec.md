# Rajasthan College Review Portal

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home page with Rajasthani-themed header (desert/fort motif), college search bar, and list of pre-defined Rajasthan colleges
- 'Add New College' flow to manually submit a college not in the list
- College detail page showing aggregated ratings and all reviews
- Review submission form with:
  - 7-category star rating system (1-5 stars each):
    1. Teaching Quality
    2. Campus Infrastructure
    3. Placement & Jobs
    4. Library & Labs
    5. Hostel & Food
    6. Value for Money
    7. Extracurricular
  - 'Why this rating?' free-text feedback textarea
  - Reviewer name (optional)
  - Submission with IP-based spam prevention (one review per IP per college)
- Report button on each review for flagging inappropriate content
- Admin dashboard (password-protected) to view all reviews, flagged reviews, and delete/approve them
- Backend stores: colleges list, reviews with IP tracking, reported reviews

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: College data store (name, city, type, pre-seeded list of ~30 Rajasthan colleges). Review store (collegeId, ratings object for 7 categories, feedback text, reviewerName, ipHash, timestamp, isReported, isApproved). Admin functions for review management.
2. Frontend pages: Home (search + college grid), College Detail (ratings summary + reviews list), Submit Review modal/page, Add College form, Admin dashboard
3. IP hashing on backend to prevent duplicate reviews per IP per college
4. Star rating UI component (interactive for submission, display-only for reviews)
5. Rajasthani header with desert/fort themed banner image
6. Mobile-first responsive layout
