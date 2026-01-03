"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Player } from "@/lib/types";
import { getSocket } from "@/lib/socket";

interface GuessingPhaseProps {
  players: Player[];
  currentPlayerId: string;
  sessionId: string;
  redCount: number;
}

export function GuessingPhase({
  players,
  currentPlayerId,
  sessionId,
  redCount,
}: GuessingPhaseProps) {
  const [guess, setGuess] = useState<string>("");
  const socket = getSocket();

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const hasGuessed = currentPlayer?.hasGuessed || false;
  const currentGuess = currentPlayer?.guess;
  const allGuessed = players.every((p) => p.hasGuessed);
  const waitingCount = players.filter((p) => !p.hasGuessed).length;
  const maxGuess = players.length;

  useEffect(() => {
    if (currentGuess !== null && currentGuess !== undefined) {
      setGuess(currentGuess.toString());
    }
  }, [currentGuess]);

  const handleGuessChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (
      value === "" ||
      (!isNaN(numValue) && numValue >= 0 && numValue <= maxGuess)
    ) {
      setGuess(value);
    }
  };

  const handleSubmitGuess = () => {
    const numGuess = parseInt(guess, 10);
    if (!isNaN(numGuess) && numGuess >= 0 && numGuess <= maxGuess) {
      socket.emit("submit-guess", {
        sessionId,
        playerId: currentPlayerId,
        guess: numGuess,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Make Your Guess</CardTitle>
        <CardDescription className="text-center">
          {allGuessed
            ? "All players have guessed. Calculating results..."
            : `Waiting for ${waitingCount} player${
                waitingCount !== 1 ? "s" : ""
              } to guess`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="guess" className="text-sm font-medium">
              How many red cards? (0-{maxGuess})
            </label>
            <Input
              id="guess"
              type="number"
              min="0"
              max={maxGuess}
              value={guess}
              onChange={(e) => handleGuessChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  guess !== "" &&
                  !isNaN(parseInt(guess, 10))
                ) {
                  handleSubmitGuess();
                }
              }}
              placeholder="Enter your guess"
              disabled={allGuessed}
              className="text-center text-2xl h-16"
            />
          </div>
          <Button
            onClick={handleSubmitGuess}
            disabled={allGuessed || guess === "" || isNaN(parseInt(guess, 10))}
            className="w-full"
            size="lg"
          >
            Submit Guess
          </Button>
        </div>
        {hasGuessed && currentGuess !== null && (
          <p className="text-center text-sm text-muted-foreground">
            Your guess: <span className="font-semibold">{currentGuess}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
