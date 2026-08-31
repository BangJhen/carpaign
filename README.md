# Carpaign

**Turn Vehicle Inventory Into Content**

---

## 📌 What is Carpaign?
Carpaign is an innovative platform connecting Automotive Dealerships/Brands with Content Creators. Creators can browse and claim "Campaigns" (such as Edit, Shoot, Publish, UGC) from available vehicle inventory and earn money for their work. The platform features a **Dark Cinematic Editorial** aesthetic, delivering a highly premium, Awwwards-quality luxury automotive vibe.

## 🚀 Key Features
- **Cinematic Landing Page**: Immersive landing page equipped with letterbox intro animations, smooth scrolling (Lenis), parallax effects, and advanced glassmorphism components.
- **Creator Dashboard**: A modern, clean dashboard summarizing creator performance, view metrics, and ongoing campaigns. Features a completely redesigned premium glassmorphic topbar.
- **Campaign Marketplace**: Browse active campaigns (Edit, Shoot, UGC, Publish). Informative campaign cards designed without excessive decorative elements.
- **Dynamic Routing**: Detailed campaign pages providing instructions, deadlines, and content criteria.
- **Leaderboard & Rank System**: A view-based competition system for creators with a tier ranking mechanism.
- **Earnings & Analytics**: In-depth analytics reports and withdrawal history.
- **User Authentication**: Secure Login/Register flows powered by `better-auth`.
- **Profile Management**: Update profiles, link portfolios, and upload profile/cover images directly to Supabase Storage.

## 📸 Demo
![Dashboard Demo](./Demo%20Photo.png)

## 🛠 Tech Stack
This project is built on a modern full-stack ecosystem:

### Frontend
- **[Next.js 16 (App Router)](https://nextjs.org/)**: React framework for SSR/SSG, performance optimization, and dynamic routing.
- **[React 19](https://react.dev/)**: Building user interfaces with Server Components support.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework styled with a custom Luxury Gold & Dark Cinematic theme.
- **[shadcn/ui](https://ui.shadcn.com/)**: Accessible, customizable UI components (built on Radix UI).
- **[Framer Motion](https://www.framer.com/motion/)**: Scroll animations, hardware-accelerated transitions, staggered reveals, and advanced dynamic interactions.
- **[Lenis](https://lenis.darkroom.engineering/)**: Smooth scroll engine for a buttery-smooth landing page experience.
- **[Lucide React](https://lucide.dev/)**: Minimalist and elegant SVG icons.

### Backend & Infrastructure
- **[Supabase](https://supabase.com/)**: Primary PostgreSQL database utilizing Connection Pooling (Transaction Mode) and Supabase Storage for media assets.
- **[Drizzle ORM](https://orm.drizzle.team/)**: Lightweight and performant TypeScript ORM.
- **[Better-Auth](https://better-auth.com/)**: Modern authentication library handling user sessions, registration, and security.
- **[Vercel](https://vercel.com/)**: Production deployment platform for Serverless edge functions.

## 💻 Local Development Setup

Follow these steps to run Carpaign on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BangJhen/carpaign.git
   cd carpaign
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the provided `.env.example` to `.env` (or `.env.local`) and configure your Supabase and Better-Auth credentials.
   ```bash
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres"
   BETTER_AUTH_SECRET="your-auth-secret"
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. **Run Database Migrations (Drizzle):**
   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser. You will be greeted by our cinematic Landing Page. Navigate to `/login` to access the creator dashboard.

## 📁 Directory Structure
- `src/app/`: Contains all App Router pages and API routes (`api/auth`).
- `src/components/landing/`: Exclusive components for the Landing Page (Hero, Features, CTA, etc.).
- `src/components/views/`: Main dashboard view components (Analytics, Profile, Campaigns).
- `src/components/ui/`: Modular UI components (Buttons, Cards, Dialogs) from *shadcn*.
- `src/components/layout/`: Main layout components (Sidebar, Glassmorphic Header).
- `src/lib/`: Utility functions and clients (Auth, Supabase).
- `src/db/`: Drizzle ORM schemas and database connection configuration.
- `public/`: Static assets (Backgrounds, Mockups).
