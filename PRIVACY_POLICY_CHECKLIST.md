# 📋 Privacy Policy Compliance Checklist

Checklist to verify compliance with Google Play Console and web privacy standards for **Indian Short Films**.

---

## Verification Status

| Requirement | Implementation | Status |
| :--- | :--- | :--- |
| **1. Public Privacy Policy URL** | Implemented on web app at `/privacy` | `READY` |
| **2. Account Data Collection Disclosed** | Explicitly lists Email, Name, Username | `READY` |
| **3. Stream Activity Disclosed** | Mentions watch progress, ratings, reviews, and comments | `READY` |
| **4. Third-Party Sharing Disclosed** | Declares no sale or unauthorized sharing of user data | `READY` |
| **5. Storage Security (RLS)** | Mentions PostgreSQL Row Level Security & HTTPS encryption | `READY` |
| **6. User Data Deletion Request** | Includes support contact email (`privacy@indianshortfilms.com`) | `READY` |
| **7. Final Legal Review** | External legal counsel validation recommended | `REQUIRED — Manual action needed` |

---

## Play Console URL Configuration

When submitting to Google Play Console -> App Content -> Privacy Policy:
* Provide the live URL: `https://your-production-domain.com/privacy`
