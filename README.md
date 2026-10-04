# Kynexs

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
│   ├── layout/       # Layout components (Navbar, Footer, Container)
│   ├── ui/           # UI components (Button, etc.)
│   └── common/       # Common components (Loading, etc.)
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── config/           # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
