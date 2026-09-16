# 🛡️ Google Play Data Safety Declarations

This document lists all data collection practices for the **Indian Short Films** mobile application as required by Google Play Console's Data Safety form.

---

## 1. Overview of Data Collection

| Data Type | Collected? | Shared? | Purpose | Required / Optional | Storage & Security |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Name** | Yes | No | Account Management, Profile Display | Required for registered users | Stored securely in PostgreSQL database via Supabase |
| **Email Address** | Yes | No | Account Authentication, Password Reset | Required for registration | Managed by Supabase Auth service |
| **App Activity (Watch History)** | Yes | No | App Functionality (Resume watching) | Optional (Only when signed in) | Saved to `watch_history` table |
| **User Content (Reviews & Comments)** | Yes | No | App Functionality, Community Discussion | Optional | Saved to `reviews` & `comments` tables |
| **User Ratings** | Yes | No | App Functionality, Film Rating Stats | Optional | Saved to `ratings` table |
| **User Submissions (Video / Artwork)** | Yes | No | Filmmaker Portal & Catalog Publishing | Optional | Uploaded to Supabase Storage buckets |

---

## 2. Data Protection & Deletion Policy

* **Encryption in Transit:** All network requests and stream payloads use TLS / HTTPS encryption (`https://qmqtnrdwxubfrrtlkbfi.supabase.co`).
* **Row Level Security (RLS):** Database policies prevent users from accessing or modifying other users' private account data.
* **Account & Data Deletion:** Users may request complete deletion of their account and stored data by contacting support or submitting a request via the Privacy Policy page.

---

## 3. Play Console Data Safety Answers

When filling out the **Data Safety** section in Google Play Console:

1. **Does your app collect or share any of the required user data types?** -> `Yes`
2. **Is all of the user data collected by your app encrypted in transit?** -> `Yes`
3. **Do you provide a way for users to request that their data be deleted?** -> `Yes`
4. **Data Types Selected:**
   - Personal info: *Name*, *Email address*
   - App activity: *App interactions* (Watch history, Ratings, Reviews)
