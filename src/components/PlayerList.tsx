import { Player } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Players ({players.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className={`p-2 rounded-md ${
                player.id === currentPlayerId
                  ? "bg-primary/10 border border-primary"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{player.name}</span>
                <div className="flex items-center gap-2">
                  {player.isHost && (
                    <span className="text-xs text-muted-foreground">
                      (Host)
                    </span>
                  )}
                  {player.id === currentPlayerId && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
