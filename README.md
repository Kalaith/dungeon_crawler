# Dungeon Crawler

A classic dungeon exploration RPG built with React and TypeScript, featuring party-based combat, exploration mechanics, and strategic gameplay.

## Game Features

- **Party Creation**: Create and customize your adventuring party
- **Turn-based Combat**: Strategic combat encounters with various enemies
- **Dungeon Exploration**: Navigate through procedurally generated dungeons
- **Character Progression**: Level up your party members and unlock new abilities

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Charts**: Chart.js for data visualization
- **Animations**: Framer Motion

## Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run type-check

# Run full CI pipeline
npm run ci
```

## Deployment

```powershell
# Deploy to preview environment
.\publish.ps1

# Deploy to production
.\publish.ps1 -Production
```

## Game Architecture

- **Game States**: Party creation, exploration, and combat phases
- **Component Structure**: Modular components for party, game, combat, and UI
- **Store Management**: Centralized game state with Zustand persistence

## Project Structure

```
dungeon_crawler/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── party/     # Party creation and management
│   │   │   ├── game/      # Main game interface
│   │   │   ├── combat/    # Combat system
│   │   │   └── ui/        # Reusable UI components
│   │   ├── stores/        # Zustand state management
│   │   └── types/         # TypeScript definitions
│   └── dist/              # Build output
└── README.md              # This file
```

Part of the WebHatchery game collection.