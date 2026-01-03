export type GamePhase = "voting" | "guessing" | "results";

export type Vote = "red" | "black" | null;

export interface Player {
  id: string;
  name: string;
  vote: Vote;
  guess: number | null;
  isCorrect: boolean | null;
  hasVoted: boolean;
  hasGuessed: boolean;
  isHost: boolean;
}

export interface Session {
  id: string;
  players: Map<string, Player>;
  phase: GamePhase;
  redCount: number;
  roundNumber: number;
  hostId: string;
}

export interface SessionState {
  id: string;
  players: Player[];
  phase: GamePhase;
  redCount: number;
  roundNumber: number;
  hostId: string;
}
