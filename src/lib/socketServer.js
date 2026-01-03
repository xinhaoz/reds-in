const {
  createSession,
  joinSession,
  updatePlayerVote,
  updatePlayerGuess,
  advancePhase,
  removePlayer,
  getSessionState,
  validateSessionName,
} = require("./sessionStore.js");
const { generateAnonymousName } = require("./utils.server.js");

function setupSocketServer(io) {
  io.on("connection", (socket) => {
    let currentSessionId = null;
    let currentPlayerId = null;

    socket.on("join-session", (data) => {
      try {
        const { sessionId, playerName } = data;

        const finalPlayerName =
          !playerName ||
          (typeof playerName === "string" && playerName.trim().length === 0)
            ? generateAnonymousName()
            : typeof playerName === "string"
            ? playerName.trim()
            : generateAnonymousName();

        let session;
        // Try to join the session first.
        try {
          session = joinSession(sessionId, finalPlayerName);
        } catch (error) {
          // If session doesn't exist, try to create it.
          if (error.message === "Session not found") {
            if (!validateSessionName(sessionId)) {
              socket.emit("error", {
                message:
                  "Invalid session name. Must be 3-50 characters, alphanumeric + hyphens/underscores only.",
              });
              return;
            }
            try {
              session = createSession(sessionId, finalPlayerName);
            } catch (createError) {
              socket.emit("error", {
                message: createError.message || "Failed to create session",
              });
              return;
            }
          } else {
            socket.emit("error", {
              message: error.message || "Failed to join session",
            });
            return;
          }
        }

        // Find the most recently added player with this name to handle potential collisions
        const playersWithName = Array.from(session.players.values())
          .filter((p) => p.name === finalPlayerName)
          .sort((a, b) => {
            // Sort by player ID timestamp (player IDs contain timestamp)
            const aTime = parseInt(a.id.split("-")[1]) || 0;
            const bTime = parseInt(b.id.split("-")[1]) || 0;
            return bTime - aTime;
          });

        const player = playersWithName[0];
        if (!player) {
          socket.emit("error", { message: "Failed to create player" });
          return;
        }

        currentSessionId = sessionId;
        currentPlayerId = player.id;

        socket.join(sessionId);
        socket.emit("session-joined", {
          sessionId,
          playerId: player.id,
          state: getSessionState(sessionId),
        });

        io.to(sessionId).emit("session-updated", {
          state: getSessionState(sessionId),
        });
      } catch (error) {
        socket.emit("error", { message: error.message || "Unknown error" });
      }
    });

    socket.on("vote", (data) => {
      try {
        const { sessionId, playerId, vote } = data;
        updatePlayerVote(sessionId, playerId, vote);

        const state = getSessionState(sessionId);
        if (state) {
          io.to(sessionId).emit("session-updated", { state });

          const allVoted = state.players.every((p) => p.hasVoted);
          if (allVoted && state.phase === "voting") {
            advancePhase(sessionId);
            const newState = getSessionState(sessionId);
            if (newState) {
              io.to(sessionId).emit("session-updated", { state: newState });
            }
          }
        }
      } catch (error) {
        socket.emit("error", {
          message: error.message || "Failed to update vote",
        });
      }
    });

    socket.on("submit-guess", (data) => {
      try {
        const { sessionId, playerId, guess } = data;
        updatePlayerGuess(sessionId, playerId, guess);

        const state = getSessionState(sessionId);
        if (state) {
          io.to(sessionId).emit("session-updated", { state });

          const allGuessed = state.players.every((p) => p.hasGuessed);
          if (allGuessed && state.phase === "guessing") {
            advancePhase(sessionId);
            const newState = getSessionState(sessionId);
            if (newState) {
              io.to(sessionId).emit("session-updated", { state: newState });
            }
          }
        }
      } catch (error) {
        socket.emit("error", {
          message: error.message || "Failed to submit guess",
        });
      }
    });

    socket.on("next-round", (data) => {
      try {
        const { sessionId, playerId } = data;
        advancePhase(sessionId, playerId);

        const state = getSessionState(sessionId);
        if (state) {
          io.to(sessionId).emit("session-updated", { state });
        }
      } catch (error) {
        socket.emit("error", {
          message: error.message || "Failed to start next round",
        });
      }
    });

    socket.on("disconnect", () => {
      if (currentSessionId && currentPlayerId) {
        removePlayer(currentSessionId, currentPlayerId);
        const state = getSessionState(currentSessionId);
        if (state) {
          io.to(currentSessionId).emit("session-updated", { state });
        }
      }
    });
  });
}

module.exports = setupSocketServer;
