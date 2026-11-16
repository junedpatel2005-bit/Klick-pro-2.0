# ProConnect / Klick-pro Mobile Application

Cross-platform mobile application architecture built with **Flutter & Dart**, connected directly to the shared **PostgreSQL database** via a dedicated high-performance **Mobile Backend API Gateway**.

---

## 📁 Architecture Overview

```
mobile_application/
├── backend/          # Dedicated Mobile API Gateway connecting to PostgreSQL
│   ├── package.json
│   ├── server.mjs    # Express REST API (Auth, Dashboard, Pros, Categories, Jobs)
│   └── .env.example
└── frontend/         # Cross-platform Flutter Application (Android, iOS, Web)
    ├── pubspec.yaml
    ├── analysis_options.yaml
    └── lib/
        ├── main.dart
        ├── core/     # Colors, typography, theme, network client
        ├── models/   # User, Professional, Job, Category
        ├── providers/# Auth, Dashboard, Search, 5-Step Job Wizard
        ├── screens/  # Onboarding, Login, Dashboard, Search, 5-Step Job Posting
        └── widgets/  # Reusable pill buttons, cards, status badges
```

---

## 📱 Video Screen & Flow Mapping

| Video Timestamp | Screen | Implemented Flutter Screen File |
|---|---|---|
| **00:00 – 00:01** | Splash & Onboarding | `lib/screens/onboarding/onboarding_screen.dart` |
| **00:02 – 00:06** | Welcome Back / Login | `lib/screens/auth/login_screen.dart` |
| **00:07 – 00:22** | Client Home / Dashboard | `lib/screens/home/dashboard_screen.dart` |
| **00:23 – 00:33** | Search & Professional Feed | `lib/screens/search/professional_search_screen.dart` |
| **00:34 – 01:34** | 5-Step Post a Job Wizard | `lib/screens/post_job/post_job_wizard_screen.dart` |
| **Persistent** | 5-Tab Navigation Bar | `lib/screens/home/main_navigation_shell.dart` |

---

## 🚀 How to Run

### 1. Start the Mobile Backend Gateway (Port 5050)
The backend service connects to your existing PostgreSQL database defined in your root `.env` (`DATABASE_URL`):

```bash
cd mobile_application/backend
npm install
npm run dev
```

The gateway will start on `http://localhost:5050` with status health-check available at:
`http://localhost:5050/api/v1/mobile/status`

### 2. Run the Flutter Mobile Application

```bash
cd mobile_application/frontend
flutter pub get
flutter run
```

*Note: For testing on an Android Emulator, the endpoint points to `10.0.2.2:5050`. For iOS Simulator / Web / Desktop, it points to `http://localhost:5050`.*

---

## 🔒 Shared Database & Security
- **Authentication**: Uses standard HS256 JWT tokens with 30-day mobile expiration.
- **Data Parity**: Writes directly to `client_jobs` and reads from `User` (role: `PROFESSIONAL`) and `service_categories`.
- **First-Letter Capitalization (Rule 5)**: All user-entered and displayed names and titles are formatted with initial capitalization.
