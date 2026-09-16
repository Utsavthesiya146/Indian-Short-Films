# 🚀 Google Play Store Release Checklist

This checklist covers all requirements needed to submit **Indian Short Films** to the Google Play Console.

---

## 📋 Pre-Submission Checklist

| Item | Requirement | Status | Action Needed |
| :--- | :--- | :--- | :--- |
| **1. App Name** | `Indian Short Films` (Max 30 chars) | `READY` | Verified in AndroidManifest.xml |
| **2. Short Description** | `Discover India. Watch Stories.` (Max 80 chars) | `READY` | Provided in PLAY_STORE_LISTING.md |
| **3. Full Description** | Detailed feature list & Indian regional cinema overview | `READY` | Provided in PLAY_STORE_LISTING.md |
| **4. App Category** | `Entertainment` / `Video Players & Editors` | `REQUIRED` | Select in Play Console setup |
| **5. Content Rating** | Complete IARC Rating Questionnaire | `REQUIRED` | Complete questionnaire during release setup |
| **6. Target Audience** | Ages 13+ / General Audience | `REQUIRED` | Specify in Store presence |
| **7. Privacy Policy URL** | Live accessible Privacy Policy URL | `READY` | `https://your-domain.com/privacy` |
| **8. Data Safety Form** | Declare account info, streaming activity & storage | `READY` | Details provided in DATA_SAFETY_NOTES.md |
| **9. App Access Credentials** | Provide test login for Play Store reviewers | `REQUIRED` | Create demo reviewer account in Supabase Auth |
| **10. Phone Screenshots** | Minimum 2 screenshots (16:9 / 9:16 aspect ratio) | `REQUIRED` | Capture screenshots from running mobile app |
| **11. App Icon** | 512 x 512 px PNG (Max 1MB) | `REQUIRED` | Upload hi-res 512px icon |
| **12. Feature Graphic** | 1024 x 500 px PNG or JPEG | `REQUIRED` | Create 1024x500 banner graphic |
| **13. Support Contact** | Public support email address | `REQUIRED` | Provide support email (e.g. support@indianshortfilms.com) |
| **14. Release Notes** | Initial release notes (Version 1.0.0) | `READY` | "Initial release of Indian Short Films mobile app." |
| **15. Signed AAB File** | Upload `.aab` (Android App Bundle) | `BLOCKED` | Build signed `.aab` using ANDROID_SIGNING_GUIDE.md |
| **16. Internal / Closed Testing**| Test release with internal testers | `REQUIRED` | Run 14-day closed test if required by Play Console |
