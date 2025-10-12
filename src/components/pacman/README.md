# Pacman Game - ONB Integration

This is a React-based Pacman game that has been integrated into the One Night Box (ONB) frontend project.

## Changes Made

### 1. TypeScript Conversion
- Converted all `.js` and `.jsx` files to `.ts` and `.tsx`
- Added proper TypeScript interfaces and type definitions
- Updated component props with proper typing

### 2. UI Framework Migration
- Replaced Material-UI components with Tailwind CSS
- Integrated with project's UI component system (`@/components/ui/button`)
- Updated styling to match project's design system

### 3. Authentication Integration
- Integrated with project's auth context (`@/contexts/auth-context`)
- Removed local user state management
- Updated user display logic to use auth context

### 4. Project Structure Alignment
- Updated import paths to use project's alias system (`@/`)
- Added proper layout component with metadata
- Integrated with Next.js App Router structure

### 5. Styling Updates
- Updated CSS modules to use project fonts (`--font-oswald`)
- Replaced MUI styling with Tailwind classes
- Maintained responsive design patterns

## File Structure

```
app/(rest)/pacman/
├── page.tsx                # Main Pacman page component
└── layout.tsx             # Layout with metadata

components/pacman/
├── index.ts               # Component exports
├── README.md              # This file
├── game/
│   ├── page.tsx          # Game component
│   └── game.module.css   # Game styles
├── mechanics/            # Game logic and mechanics
└── models/               # Game models and entities
```

## Usage

The Pacman game is accessible at `/pacman` route and integrates seamlessly with the ONB platform's authentication and styling system.

## Features

- Full-screen game experience
- Mobile joystick controls
- Responsive design
- Integration with ONB auth system
- TypeScript support
- Tailwind CSS styling
