"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { VotingPhase } from "@/components/VotingPhase";
import { GuessingPhase } from "@/components/GuessingPhase";
import { ResultsPhase } from "@/components/ResultsPhase";
import { PlayerList } from "@/components/PlayerList";
import { SettingsMenu } from "@/components/SettingsMenu";
import { Card, CardContent } from "@/components/ui/card";
import { getSocket } from "@/lib/socket";

export default function SessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const playerName = searchParams.get("playerName");

  const { sessionState, playerId, error, isConnected } = useSocket(
    sessionId,
    playerName || null,
  );

  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (sessionId && !hasJoined && isConnected) {
      const socket = getSocket();
      socket.emit("join-session", {
        sessionId,
        playerName: playerName || "",
      });
      setHasJoined(true);
    }
  }, [sessionId, playerName, isConnected, hasJoined]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="text-primary hover:underline"
              >
                Go back to home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionState || !playerId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                {isConnected ? "Connecting to session..." : "Connecting..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <SettingsMenu />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Session: {sessionId}</h1>
          <p className="text-muted-foreground">
            Round {sessionState.roundNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {sessionState.phase === "voting" && (
              <VotingPhase
                players={sessionState.players}
                currentPlayerId={playerId}
                sessionId={sessionId}
              />
            )}
            {sessionState.phase === "guessing" && (
              <GuessingPhase
                players={sessionState.players}
                currentPlayerId={playerId}
                sessionId={sessionId}
                redCount={sessionState.redCount}
              />
            )}
            {sessionState.phase === "results" && (
              <ResultsPhase
                players={sessionState.players}
                currentPlayerId={playerId}
                sessionId={sessionId}
                redCount={sessionState.redCount}
                roundNumber={sessionState.roundNumber}
              />
            )}
          </div>

          <div>
            <PlayerList
              players={sessionState.players}
              currentPlayerId={playerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
