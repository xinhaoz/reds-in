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
  const [privacyScreen, setPrivacyScreen] = useState(false);
  const socket = getSocket();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const hasVoted = currentPlayer?.hasVoted || false;
  const currentVote = currentPlayer?.vote || null;
  const allVoted = players.every((p) => p.hasVoted);
  const waitingCount = players.filter((p) => !p.hasVoted).length;

  // Check if player joined late: hasVoted is true but vote is null/undefined.
  // This indicates they were marked as having voted to not block progress, but didn't actually participate.
  const isLateJoiner =
    hasVoted && (currentVote === null || currentVote === undefined);


  useEffect(() => {
    if (currentVote) {
      setSelectedVote(currentVote);
    }
  }, [currentVote]);

  const handleVote = (vote: "red" | "black") => {
    // Toggle: if clicking the same vote, deselect it
    const newVote = selectedVote === vote ? null : vote;
    setSelectedVote(newVote);
    if (newVote) setPrivacyScreen(true);
    socket.emit("vote", {
      sessionId,
      playerId: currentPlayerId,
      vote: newVote,
    });
  };

  if (isLateJoiner) {
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
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-lg text-muted-foreground">
              You joined this round after it had already started.
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              You&apos;re observing this round. You&apos;ll be able to
              participate in the next round.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    {privacyScreen && (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-6">
        <p className="text-white text-2xl font-semibold">Vote submitted</p>
        <p className="text-white/50 text-sm">
          Waiting for {waitingCount} player{waitingCount !== 1 ? "s" : ""} to vote
        </p>
        <p className="text-white/30 text-xs">
          You voted <span className="font-semibold">{selectedVote?.toUpperCase()}</span>
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setPrivacyScreen(false);
            socket.emit("vote", {
              sessionId,
              playerId: currentPlayerId,
              vote: null,
            });
          }}
        >
          Change vote
        </Button>
      </div>
    )}
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
                ? "bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 ring-2 ring-white ring-offset-background"
                : "bg-red-600/60 hover:bg-red-700/70 dark:bg-red-500/50 dark:hover:bg-red-600/70 text-white"
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
    </>
  );
}
