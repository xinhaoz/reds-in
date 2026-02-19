# Reds In

A real-time multiplayer card guessing game played in the browser.

## How to play

Players join a shared session and go through three phases each round:

1. **Vote** — Each player secretly votes Red or Black.
2. **Guess** — After all votes are in, each player guesses how many red cards are in the pile.
3. **Results** — The correct count is revealed. Players who guessed right win the round. The host starts the next round when ready.

## Running locally

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000), create a session, and share the URL with other players.
