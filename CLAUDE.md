# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Development server (runs custom Node server, not next dev)
pnpm build    # Next.js production build
pnpm start    # Production server
pnpm lint     # ESLint
```

**Important:** This project uses a custom Node.js server (`server.js`) to integrate Socket.IO. Never use `next dev` directly — always use `pnpm dev`.

## Architecture

This is a real-time multiplayer card guessing game built with Next.js 14 (App Router) + Socket.IO.

### Custom Server (`server.js`)
The root `server.js` creates an HTTP server, attaches Socket.IO at `/api/socket`, then passes remaining requests to Next.js. CORS is open (`*`). The `src/app/api/socket/` directory is an empty placeholder — all socket logic runs through the custom server.

### Real-Time Layer
- **`src/lib/socketServer.js`** — All Socket.IO event handlers (join-session, vote, submit-guess, next-round, disconnect)
- **`src/lib/sessionStore.js`** — In-memory session storage using `Map`. No persistence; data resets on server restart.
- **`src/hooks/useSocket.ts`** — Client-side hook managing the Socket.IO connection and session state
- **`src/lib/socket.ts`** — Socket.IO client singleton

### Game Flow
Three phases cycle in order:
1. **Voting** — Players vote RED or BLACK (togglable until all have voted)
2. **Guessing** — Players guess the count of red cards (0 to player count)
3. **Results** — Correct answer revealed; only the host can advance to next round

Phase transitions are triggered server-side: voting→guessing when all players have voted, guessing→results when all players have guessed, results→voting on host's `next-round` event.

Players joining during guessing or results phases are marked as observers (`hasVoted = true`, `hasGuessed = true`) so they don't block transitions.

### Key Types (`src/lib/types.ts`)
- `GamePhase`: `"voting" | "guessing" | "results"`
- `Session` (server-side, uses `Map<string, Player>`) vs `SessionState` (client-facing, uses `Player[]`)
- Session IDs: validated as `/^[a-zA-Z0-9_-]{3,50}$/` on both client and server

### Frontend Components
- **`src/app/page.tsx`** — Home: session creation/joining, player name input
- **`src/app/[sessionId]/page.tsx`** — Game view: dispatches to phase-specific components
- **`src/components/`** — `VotingPhase`, `GuessingPhase`, `ResultsPhase`, `PlayerList`, `SettingsMenu`
- **`src/components/ui/`** — Radix UI-based primitives (Button, Card, Input, Dialog)

### Styling
Tailwind CSS with class-based dark mode. Semantic HSL CSS variables defined in `src/app/globals.css` under `:root` (light) and `.dark` (dark). Theme persisted in `localStorage` key `'theme'`.

### Notable Patterns
- Anonymous player names are auto-generated as `{Noun}{Number}` (e.g., "Tiger42") in `src/lib/utils.server.js`
- Host is reassigned automatically on disconnect
- Sessions are cleaned up when the last player leaves
- `src/lib/sessionStore.js` and `src/lib/sessionStore.ts` coexist — the `.js` file is the runtime implementation, `.ts` contains type definitions
