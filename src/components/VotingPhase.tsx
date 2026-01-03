"use client";

import { useState, useEffect } from "react";
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

interface VotingPhaseProps {
  players: Player[];
  currentPlayerId: string;
  sessionId: string;
}

export function VotingPhase({
  players,
  currentPlayerId,
  sessionId,
}: VotingPhaseProps) {
  const [selectedVote, setSelectedVote] = useState<"red" | "black" | null>(
    null,
  );
  const socket = getSocket();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const hasVoted = currentPlayer?.hasVoted || false;
  const currentVote = currentPlayer?.vote || null;
  const allVoted = players.every((p) => p.hasVoted);
  const waitingCount = players.filter((p) => !p.hasVoted).length;

  useEffect(() => {
    if (currentVote) {
      setSelectedVote(currentVote);
    }
  }, [currentVote]);

  const handleVote = (vote: "red" | "black") => {
    // Toggle: if clicking the same vote, deselect it
    const newVote = selectedVote === vote ? null : vote;
    setSelectedVote(newVote);
    socket.emit("vote", {
      sessionId,
      playerId: currentPlayerId,
      vote: newVote,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cast Your Vote</CardTitle>
        <CardDescription className="text-center">
          {allVoted
            ? "All players have voted. Moving to guessing phase..."
            : `Waiting for ${waitingCount} player${
                waitingCount !== 1 ? "s" : ""
              } to vote`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className={`flex-1 h-24 text-xl text-white font-bold ${
              selectedVote === "red"
                ? "bg-red-600 hover:bg-red-700 ring-2 ring-white ring-offset-background"
                : "bg-red-500/50 hover:bg-red-600/70 text-white"
            }`}
            onClick={() => handleVote("red")}
            disabled={allVoted}
          >
            RED
          </Button>
          <Button
            size="lg"
            className={`border-none flex-1 h-24 text-xl text-white font-bold ${
              selectedVote === "black"
                ? "bg-gray-800 hover:bg-gray-900 ring-2 ring-white ring-offset-background"
                : "bg-gray-900 hover:bg-gray-700/70 text-white"
            }`}
            onClick={() => handleVote("black")}
            disabled={allVoted}
          >
            BLACK
          </Button>
        </div>
        {selectedVote && (
          <p className="text-center text-sm text-muted-foreground">
            You selected:{" "}
            <span className="font-semibold">{selectedVote.toUpperCase()}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
