"use client";

import { useState, useEffect } from "react";
import { Settings, Moon, Sun, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type View = "settings" | "instructions";

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("settings");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load theme from localStorage or detect system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset to settings view when dialog closes
      setView("settings");
    }
  };

  const renderSettingsView = () => (
    <>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Customize your game experience.</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 px-6 pb-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="min-w-[100px]"
          >
            {theme === "dark" ? (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </>
            )}
          </Button>
        </div>

        {/* Game Instructions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5" />
            <div>
              <p className="font-medium">Game Instructions</p>
              <p className="text-sm text-muted-foreground">
                Learn how to play Reds In
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("instructions")}
            className="min-w-[100px]"
          >
            View
          </Button>
        </div>
      </div>
    </>
  );

  const renderInstructionsView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("settings")}
            className="h-8 w-8"
            aria-label="Back to settings"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle>How to Play Reds In</DialogTitle>
            <DialogDescription>Game rules and instructions</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="px-6 pb-6">
        <Card>
          <CardContent className="pt-6 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Objective</h3>
              <p className="text-muted-foreground">
                Guess the number of red cards in the pile after all players have
                voted.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gameplay</h3>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>
                  <strong>Voting Phase:</strong> Each player secretly votes
                  either Red or Black. You can change your vote by clicking the
                  same card again.
                </li>
                <li>
                  <strong>Guessing Phase:</strong> After all votes are cast,
                  players guess how many red cards are in the pile.
                </li>
                <li>
                  <strong>Results Phase:</strong> See if your guess was correct.
                  The host can start the next round when ready.
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Winning</h3>
              <p className="text-muted-foreground">
                Players who correctly guess the number of red cards win that
                round. Play continues for multiple rounds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-40"
        onClick={() => setOpen(true)}
        aria-label="Open settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showClose={true} onClose={() => handleOpenChange(false)}>
          {view === "settings"
            ? renderSettingsView()
            : renderInstructionsView()}
        </DialogContent>
      </Dialog>
    </>
  );
}
