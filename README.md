# 🚀 Modern Full-Stack Developer Portfolio

An interactive, dynamic full-stack developer portfolio and content management system (CMS) built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP**, and **PostgreSQL**.

Featuring real-time dynamic database querying, fluid animations via GSAP Flip & ScrollTrigger, interactive filter systems, and a fully functional Admin Panel for managing projects, skills, certificates, and categories.

---

## ✨ Features

- **🌐 Dynamic Portfolio Frontend:**
  - **Animated Hero & Sections:** Powered by GSAP and ScrollTrigger for high-performance scroll and layout transitions.
  - **Dynamic Skills Grid:** Categorized skills with real-time filtering and junction-table database relationships.
  - **Interactive Project Showcase:** Multi-category filtering powered by GSAP `Flip` layout animations.
  - **Certificates & Accomplishments:** Interactive view modals, multi-category badges, and direct verification links.
  - **Fully Responsive & Modern UI:** Styled using Tailwind CSS with ambient glow effects and dark mode aesthetic.

- **🛠️ Admin Content Management System (CMS):**
  - **Category Management:** Full CRUD (Create, Read, Update, Delete) for custom skill, project, and certificate categories.
  - **Dynamic Skill Junctions:** Map individual skills and certificates to multiple custom categories dynamically.
  - **File & Image Uploads:** Seamless preview and Base64/media handling for certificate credentials and project assets.
  - **Protected Admin Panel:** Secure authentication layout and endpoint handlers.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP](https://gsap.com/) (Flip, ScrollTrigger)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** PostgreSQL / [Neon Postgres](https://neon.tech/) (`@neondatabase/serverless` or raw SQL client)
- **Authentication:** Custom Auth / Middleware Proxy

---

## 📂 Project Structure

```text
portfolio/
├── sql/
│   └── schema.sql
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── certificates/
│   │   │   ├── projects/
|   |   |   ├── login/
│   │   │   ├── skills/
|   |   |   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── certificates/
│   │   │   ├── projects/
│   │   │   ├── profile/
│   │   │   └── skills/
│   │   ├── certificates/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
|   |   ├── Navbar.tsx
│   ├── lib/
│   |   ├── auth-client.ts
|   |   ├── auth.ts
│   |   └── db.ts
|   └── proxy.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```
