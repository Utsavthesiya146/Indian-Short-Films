# 📲 Google Play Console Upload & Release Guide

This guide provides the exact step-by-step instructions to publish the **Indian Short Films** Android Application Bundle (`.aab`) to the Google Play Store.

---

## 1. Prerequisites Checklist

Before creating a new release in Google Play Console, ensure you have:
1. **Signed Android App Bundle (`.aab`)**: Built via `flutter build appbundle --release` (following `ANDROID_SIGNING_GUIDE.md`).
2. **App Branding Assets**:
   - **App Icon**: 512 x 512 px PNG (Max 1 MB).
   - **Feature Graphic**: 1024 x 500 px PNG or JPEG.
   - **Phone Screenshots**: Minimum 2 screenshots (16:9 or 9:16 aspect ratio).
3. **Public Privacy Policy URL**: `https://your-production-domain.com/privacy`.
4. **Google Play Console Developer Account**: Verified developer access at [play.google.com/console](https://play.google.com/console).

---

## 2. Step-by-Step Google Play Console Setup

### Step 1: Create App Listing
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app** (top right).
3. Fill in basic details:
   - **App name:** `Indian Short Films`
   - **Default language:** `English (United States)`
   - **App or game:** `App`
   - **Free or paid:** `Free`
4. Accept Developer Declarations and click **Create app**.

---

### Step 2: Complete Store Listing
Navigate to **Store presence -> Main store listing**:
1. **Short description** (Max 80 chars):  
   `Discover India. Watch Stories. Stream award-winning short films across India.`
2. **Full description**:  
   Copy full marketing copy from `PLAY_STORE_LISTING.md`.
3. **Graphics:**
   - Upload 512x512 **App Icon**.
   - Upload 1024x500 **Feature Graphic**.
   - Upload at least 2 **Phone Screenshots** (from running mobile app).
4. Click **Save**.

---

### Step 3: Complete App Content Declarations
Navigate to **Policy and programmes -> App content**:
1. **Privacy Policy**:  
   Enter your live URL: `https://your-production-domain.com/privacy`.
2. **Data Safety**:  
   Fill out questionnaire using disclosures provided in `DATA_SAFETY_NOTES.md`:
   - Declare collection of *Name*, *Email address*, and *App activity (Watch history, Ratings, Reviews)*.
   - Confirm encryption in transit (HTTPS) and user data deletion support.
3. **Target Audience & Content**:  
   - Select age group: `13+` or `18 and over`.
4. **Content Rating (IARC)**:  
   - Complete the questionnaire (Select Category: *Entertainment / Streaming*).
5. **App Access**:  
   - If test login is required for reviewers, provide test user credentials.

---

### Step 4: Upload Release Bundle (.aab)
1. Navigate to **Testing -> Internal testing** (or **Closed testing**).
2. Click **Create new release**.
3. Under **App bundles**, click **Upload** and select your signed `app-release.aab` file:
   ```text
   D:\Indian Short Films\apps\mobile\build\app\outputs\bundle\release\app-release.aab
   ```
4. **Release name:** Enter `1.0.0 (1)`.
5. **Release notes:** Enter:  
   `Initial release of Indian Short Films mobile application.`
6. Click **Save** -> **Review release**.

---

### Step 5: Promote to Production
1. After testing internally and verifying no crashes occur:
2. Go to **Testing -> Internal testing** -> Click **Promote release -> Production**.
3. Review release warnings and click **Start rollout to Production**.
4. The application will enter Google Play Review (typically 1–3 business days).
