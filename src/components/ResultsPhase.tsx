"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Player } from "@/lib/types";
import { getSocket } from "@/lib/socket";
import { CheckCircle2, XCircle } from "lucide-react";

interface ResultsPhaseProps {
  players: Player[];
  currentPlayerId: string;
  sessionId: string;
  redCount: number;
  roundNumber: number;
}

export function ResultsPhase({
  players,
  currentPlayerId,
  sessionId,
  redCount,
  roundNumber,
}: ResultsPhaseProps) {
  const socket = getSocket();
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isCorrect = currentPlayer?.isCorrect ?? null;
  const isHost = currentPlayer?.isHost ?? false;

  const handleNextRound = () => {
    socket.emit("next-round", { sessionId, playerId: currentPlayerId });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Round {roundNumber} Results
        </CardTitle>
        <CardDescription className="text-center">
          Red cards in the pile:{" "}
          <span className="font-bold text-lg">{redCount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          {isCorrect ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-32 h-32 text-green-500" />
              <p className="text-3xl font-bold text-green-500">CORRECT!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="w-32 h-32 text-red-500" />
              <p className="text-3xl font-bold text-red-500">INCORRECT</p>
            </div>
          )}
          <p className="text-muted-foreground mt-4">
            Your guess: {currentPlayer?.guess ?? "N/A"} | Actual: {redCount}
          </p>
        </div>
        {isHost ? (
          <Button onClick={handleNextRound} className="w-full" size="lg">
            Next Round
          </Button>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Waiting for host to start the next round...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
