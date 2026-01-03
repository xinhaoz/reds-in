const {
  validateSessionName,
  generateRandomSessionId,
} = require("./utils.server.js");

const sessions = new Map();

function createSession(sessionId, playerName) {
  if (sessions.has(sessionId)) {
    throw new Error("Session already exists");
  }

  const playerId = `player-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const player = {
    id: playerId,
    name: playerName,
    vote: null,
    guess: null,
    isCorrect: null,
    hasVoted: false,
    hasGuessed: false,
    isHost: true,
  };

  const session = {
    id: sessionId,
    players: new Map([[playerId, player]]),
    phase: "voting",
    redCount: 0,
    roundNumber: 1,
    hostId: playerId,
  };

  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  return sessions.get(sessionId);
}

function joinSession(sessionId, playerName) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const playerId = `player-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const player = {
    id: playerId,
    name: playerName,
    vote: null,
    guess: null,
    isCorrect: null,
    hasVoted: false,
    hasGuessed: false,
    isHost: false,
  };

  session.players.set(playerId, player);
  return session;
}

function updatePlayerVote(sessionId, playerId, vote) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.phase !== "voting") {
    throw new Error("Not in voting phase");
  }

  const player = session.players.get(playerId);
  if (!player) {
    throw new Error("Player not found");
  }

  player.vote = vote;
  player.hasVoted = vote !== null;

  return session;
}

function updatePlayerGuess(sessionId, playerId, guess) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.phase !== "guessing") {
    throw new Error("Not in guessing phase");
  }

  const player = session.players.get(playerId);
  if (!player) {
    throw new Error("Player not found");
  }

  player.guess = guess;
  player.hasGuessed = true;

  return session;
}

function advancePhase(sessionId, playerId) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.phase === "voting") {
    const allVoted = Array.from(session.players.values()).every(
      (p) => p.hasVoted,
    );
    if (!allVoted) {
      throw new Error("Not all players have voted");
    }

    const redCount = Array.from(session.players.values()).filter(
      (p) => p.vote === "red",
    ).length;
    session.redCount = redCount;
    session.phase = "guessing";
  } else if (session.phase === "guessing") {
    const allGuessed = Array.from(session.players.values()).every(
      (p) => p.hasGuessed,
    );
    if (!allGuessed) {
      throw new Error("Not all players have guessed");
    }

    session.players.forEach((player) => {
      player.isCorrect = player.guess === session.redCount;
    });

    session.phase = "results";
  } else if (session.phase === "results") {
    // Only the host can advance from results to voting
    if (playerId && playerId !== session.hostId) {
      throw new Error("Only the host can start the next round");
    }

    session.roundNumber += 1;
    session.phase = "voting";
    session.redCount = 0;
    session.players.forEach((player) => {
      player.vote = null;
      player.guess = null;
      player.isCorrect = null;
      player.hasVoted = false;
      player.hasGuessed = false;
    });
  }

  return session;
}

function removePlayer(sessionId, playerId) {
  const session = sessions.get(sessionId);
  if (!session) {
    return;
  }

  const wasHost = session.hostId === playerId;
  session.players.delete(playerId);

  // Reassign host if the host left and there are still players
  if (wasHost && session.players.size > 0) {
    // Clear isHost on all players first
    session.players.forEach((player) => {
      player.isHost = false;
    });
    // Assign new host
    const newHost = Array.from(session.players.values())[0];
    session.hostId = newHost.id;
    newHost.isHost = true;
  }

  if (session.players.size === 0) {
    sessions.delete(sessionId);
  }
}

function getSessionState(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  return {
    id: session.id,
    players: Array.from(session.players.values()),
    phase: session.phase,
    redCount: session.redCount,
    roundNumber: session.roundNumber,
    hostId: session.hostId,
  };
}

module.exports = {
  createSession,
  getSession,
  joinSession,
  updatePlayerVote,
  updatePlayerGuess,
  advancePhase,
  removePlayer,
  getSessionState,
  validateSessionName,
  generateRandomSessionId,
};
