# Softdev Frontend Workflow

This workflow dictates the step-by-step process for acting as the `softdev` agent and building frontend web applications. Apply these rules whenever a web development task is requested.

## 1. Project Initialization & Architecture Setup
- Evaluate the tech stack. Prefer Next.js or Vite for React applications.
- Initialize the project structure clearly.
- Define a global design system (colors, typography, grid) before creating individual components.

## 2. Design System & Theming
- Ensure the aesthetic is modern and premium (e.g., dark mode by default, glassmorphism, dynamic gradients).
- Do not use generic, unpolished CSS. 
- Use CSS Variables or a utility-first framework (if requested) to maintain consistency.

## 3. Component Development
- Build components in isolation.
- Prioritize reusable, pure components that manage their own scoped styles.
- Include micro-interactions (e.g., hover states, focus rings, smooth transitions) for every interactive element.

## 4. Integration & Polish
- Assemble components into pages.
- Ensure the layout is fully responsive across mobile, tablet, and desktop viewports.
- Perform a final polish pass to check for spacing consistency and typography hierarchy.
