# 🧪 Testing & Verification Guide

## Automated Web Verification
Run Next.js build verification:
```bash
cd apps/web
npm run build
```

## Test Scenarios Checklist
- [x] Web build succeeds cleanly without TypeScript or ESLint errors
- [x] Home page renders Hero spotlight banner, Trending row, and Top Rated row
- [x] Live debounced search filters films by title, director, and language
- [x] HTML5 Video Player streams video with play/pause, seek, fullscreen, and time display
- [x] 1-5 Star Ratings recalculate average score and total count
- [x] Review & Comment submission forms validate text length and anti-spam constraints
- [x] Filmmaker submission form accepts details and displays confirmation
- [x] Admin dashboard renders live metrics, submission review modal with rejection reason, and moderation report queue
