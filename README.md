# ✈️ Roam: AI Travel Planner

**Live Application:** [https://roam-travel-planner-tau.vercel.app/](https://roam-travel-planner-tau.vercel.app/)

Roam is a full-stack, AI-powered travel itinerary generator. It allows users to input their dream destination, budget, and trip duration to receive a fully structured, day-by-day travel plan. Users can authenticate, save their favorite itineraries to a secure database, and manage their trips via a personalized dashboard.

## ✨ Key Features

* **AI-Powered Itinerary Generation:** Dynamically creates detailed, day-by-day trip plans including activities, time of day, descriptions, and estimated costs.
* **Secure Authentication:** Complete user login and registration flows powered by Clerk.
* **Personalized Dashboard:** A protected route where authenticated users can view their saved trips.
* **Full CRUD Functionality:** Users can generate (Create), view (Read), and delete (Delete) their saved itineraries.
* **Responsive UI:** A clean, modern interface built with Tailwind CSS that works seamlessly across desktop and mobile devices.

## 🛠️ Tech Stack & Tools

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Authentication:** Clerk
* **Database:** PostgreSQL (hosted on Supabase)
* **ORM:** Prisma
* **Deployment:** Vercel

## 🧠 Behind the Scenes: How It Works

1. **Client-Side Request:** The user interacts with the React frontend, selecting their destination, budget, and trip length.
2. **AI Processing:** A Next.js API route (`/api/generate-trip`) processes this request and calls a Generative AI model. The prompt is strictly engineered to return the itinerary in a structured JSON format.
3. **Authentication Verification:** When a user decides to save a trip, the `/api/save-trip` endpoint intercepts the request. It uses Clerk's `auth()` to verify the user's session and extract their unique `userId`.
4. **Database Transaction:** Using Prisma ORM, the application maps the structured AI response and the `userId` to the PostgreSQL database hosted on Supabase.
5. **Data Retrieval:** When the user navigates to `/trips`, a server-side component queries the database for records specifically matching their `userId`, rendering the dynamic dashboard.
