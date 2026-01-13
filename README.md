# Pet Discovery - Find Your New Best Friend 🐾

A modern, mobile-first React application designed to help users find adoptable pets, manage adoption applications, and interact with shelters. Built with **React**, **TypeScript**, **Vite**, and **Supabase**.

## 🚀 Features

-   **Pet Discovery**: Browse specific categories (Dogs, Cats, Birds) or search for pets.
-   **Smart Filtering**: Filter by category, location, and more.
-   **Pet Details**: View comprehensive information about each pet, including age, breed, and distance.
-   **Favorites**: Save pets to your favorites list for easy access.
-   **Adoption Applications**:
    -   Apply for pets directly through the app.
    -   Track application status (Submitted, Reviewing, Approved).
    -   Edit pending applications.
-   **User Authentication**: Secure sign-up and login powered by Supabase Auth.
-   **AI Integration**: Uses Google Gemini to generate "AI Match Scores" and pet descriptions (simulated context).
-   **Mobile Ready**: Fully responsive design with PWA (Progressive Web App) support for "add to home screen" capability.
-   **Real-time Features**: (In Progress) Chat with shelters and get real-time status updates.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, Vanilla CSS (for custom animations)
-   **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
-   **AI**: Google GenAI SDK (Gemini)
-   **Icons**: Material Symbols

## ⚙️ Setup & Installation

### Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   A [Supabase](https://supabase.com/) account.
-   A [Google AI Studio](https://aistudio.google.com/) API Key (optional, for AI features).

### 1. Clone the Repository

```bash
git clone https://github.com/daydaychan/adopt-pet-app.git
cd adopt-pet-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add your keys:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup (Supabase)

1.  Go to your Supabase project dashboard -> SQL Editor.
2.  Run the contents of `supabase/schema.sql` to create tables and security policies.
3.  Run the contents of `supabase/seed.sql` to populate initial pet data.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile (PWA) Setup

This app is configured as a PWA. To test on mobile:

1.  Deploy the app (or run locally with network access).
2.  Open the URL on your mobile browser.
3.  Select **"Add to Home Screen"** from your browser menu.
4.  The app will install and run like a native application.

## 📂 Project Structure

```
src/
├── lib/           # Supabase and API clients
├── pages/         # Application Views (Home, Login, PetDetails, etc.)
├── types.ts       # TypeScript Interfaces
├── App.tsx        # Main Router and State Management
└── ...
supabase/
├── schema.sql     # Database Schema & RLS Policies
└── seed.sql       # Initial Data
```

## 🔒 Security

-   **Row Level Security (RLS)** is enabled on all database tables.
-   Users can only access/modify their own personal data (profiles, applications, favorites).
-   Pet data is publicly readable.

設計一個網上寵物領養應用程式

backend promtp:
Analyze this front-end code and complete the following tasks:
1. Generate the corresponding back-end code for the front-end code, ensuring seamless communication between the front-end and back-end to create a fully integrated application.
2. Use the Supabase database for data storage.

UI promtp:
For this application, we need to implement a PC-based backend management function with the following requirements:
1. The UI style should be consistent with the existing app.
2. It should be implemented as a separate module, without mixing with or modifying existing code.
3. The functionalities include:
- Adding pet information; images should be stored using Cloudflare R2. When a user uploads an image, it should be uploaded to Cloudflare R2, and the image URL should be returned.
- Viewing all pet information.
- Taking down adopted pets from the app, but not from the management backend.
