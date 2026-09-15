<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Global Project Workflow & Rules

## 1. Automatic Skill Activation
When working on frontend tasks, UI design, or React/Next.js components in this repository, **you (the AI Agent) must automatically apply the following skills without waiting for explicit user instruction**:
- `frontend-design`: Always apply bold, intentional, and premium modern aesthetics. Do not generate generic UI.
- `taste-skill`: Enforce high-taste visual craftsmanship, eliminate "AI-tells" (like generic purple gradients or clunky cards), and ensure authentic production-grade aesthetics.
- `emil-design-eng` & `animate`: Master-level UI animation and interaction guidelines (Emil Kowalski / Sonner creator) — focusing on physics, stagger timing, 60fps hardware-accelerated transitions, and micro-interactions.
- `shadcn`: Always use proper shadcn/ui CLI commands and adhere to Tailwind/Radix UI best practices.
- `web-design-guidelines`: Enforce strict spacing, typography, and accessibility guidelines.
- `react-best-practices` & `next-best-practices`: Implement optimal React composition patterns, Server Components by default, and efficient data fetching.
- `deploy-to-vercel`: Guidelines and automated workflows for deploying apps/previews to Vercel.

*Note for the Agent: If you are unsure about the specifics of these skills, actively read their respective `SKILL.md` files located in `.agents/skills/` before starting the task.*

## 2. Image to Code Workflow
Whenever the user asks to convert a design, pitchdeck, or image into code:
1. Actively analyze the layout, typography, and color palette.
2. Utilize the design system configured in `globals.css` and `tailwind.config.ts`.
3. Build responsive and pixel-perfect layouts, applying smooth `framer-motion` scroll animations where appropriate to elevate the UX.

## 3. Anti-AI Slop & UI Craftsmanship Rules
To preserve authentic, enterprise-grade, human-crafted design quality:
- **Strictly No Emojis in UI / Copy**: Never use emojis (e.g. ⚠️, ✨, 🚀, 💡, 🔥, 🚗, etc.) in user interfaces, buttons, notifications, alerts, headings, or marketing copy.
- **No Decorative Non-Alphabetical ASCII Glyphs**: Avoid artificial text decorations and ASCII symbols (e.g. ✦, ❖, ▶, etc.) used as faux icons or bullet dividers. Use semantic typographic spacing, subtle opacity dividers, or genuine SVG icons.
- **Avoid Generic / Overused Icons**: Do not add arbitrary sparkles or decorative novelty icons. Only use purposeful, semantically meaningful icons (e.g., `Plus`, `Trash2`, `Pencil`, `MapPin`, `ChevronRight`) rendered with appropriate muted opacities (`text-white/40`, `text-white/60`).
- **Clean, Professional Indonesian Copy**: Write direct, natural, human Indonesian text without AI cliches, hyperbole, or robotic phrasing.
