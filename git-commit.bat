@echo off
git add .
git commit -m "feat(ui): increase board size by 6%% maintaining exact 5:7 card proportions

- Updated getBoardSize() with 6%% increased dimensions
- All heights maintain exact width * 1.4 ratio for card proportions
- Updated demo mode dimensions with same 6%% increase
- Fixed CSS container queries to match new proportions
- All breakpoints (mobile/tablet/desktop/2k/ultrawide) updated
- Maintains professional gaming layout with proper card aspect ratios
- Board now slightly larger but preserves rectangular card-game feel

Technical details:
- Mobile: 48.8rem × 68.32rem (was 46rem × 64.4rem)
- Tablet: 57.2rem × 80.08rem (was 54rem × 75.6rem)
- Desktop: 64.7rem × 90.58rem (was 61rem × 85.4rem)
- 2K: 80.6rem × 112.84rem (was 76rem × 106.4rem)
- All maintain exact 1:1.4 ratio for playing card proportions"
git push origin HEAD