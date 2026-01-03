"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsMenu } from "@/components/SettingsMenu";
import { validateSessionName, generateRandomSessionId } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [joinSessionId, setJoinSessionId] = useState("");
  const [createSessionName, setCreateSessionName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleJoinSession = () => {
    if (!joinSessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }
    setError("");
    const nameParam = playerName.trim()
      ? `?playerName=${encodeURIComponent(playerName)}`
      : "";
    router.push(`/${joinSessionId}${nameParam}`);
  };

  const handleCreateSession = (useCustomName: boolean) => {
    if (useCustomName) {
      if (!createSessionName.trim()) {
        setError("Please enter a session name");
        return;
      }
      if (!validateSessionName(createSessionName)) {
        setError(
          "Invalid session name. Must be 3-50 characters, alphanumeric + hyphens/underscores only.",
        );
        return;
      }
      setError("");
      const nameParam = playerName.trim()
        ? `?playerName=${encodeURIComponent(playerName)}&isNew=true`
        : "?isNew=true";
      router.push(`/${createSessionName}${nameParam}`);
    } else {
      const randomId = generateRandomSessionId();
      setError("");
      const nameParam = playerName.trim()
        ? `?playerName=${encodeURIComponent(playerName)}&isNew=true`
        : "?isNew=true";
      router.push(`/${randomId}${nameParam}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SettingsMenu />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Reds In</CardTitle>
          <CardDescription className="text-center">
            Join or create a game session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Your Name{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="playerName"
              placeholder="Enter your name (or leave blank for anonymous)"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="joinSessionId" className="text-sm font-medium">
                Join Existing Session
              </label>
              <div className="flex gap-2">
                <Input
                  id="joinSessionId"
                  placeholder="Enter session ID"
                  value={joinSessionId}
                  onChange={(e) => {
                    setJoinSessionId(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJoinSession();
                    }
                  }}
                />
                <Button onClick={handleJoinSession}>Join</Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="createSessionName"
                className="text-sm font-medium"
              >
                Create New Session
              </label>
              <div className="flex gap-2">
                <Input
                  id="createSessionName"
                  placeholder="Custom session name (optional)"
                  value={createSessionName}
                  onChange={(e) => {
                    setCreateSessionName(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && createSessionName.trim()) {
                      handleCreateSession(true);
                    }
                  }}
                />
                <Button
                  onClick={() => handleCreateSession(true)}
                  disabled={isCreating}
                >
                  Create
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleCreateSession(false)}
                disabled={isCreating}
              >
                Quick Start (Random ID)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
