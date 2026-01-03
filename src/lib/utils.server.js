// Server-only utilities (CommonJS)
// Frontend should use utils.ts instead
function validateSessionName(name) {
  const regex = /^[a-zA-Z0-9_-]{3,50}$/;
  return regex.test(name);
}

function generateRandomSessionId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const ANONYMOUS_NOUNS = [
  "Penguin", "Tiger", "Wizard", "Explorer", "Phoenix", "Dolphin", "Eagle",
  "Fox", "Lion", "Bear", "Wolf", "Owl", "Shark", "Dragon", "Falcon",
  "Raven", "Panther", "Jaguar", "Hawk", "Cobra", "Viper", "Stallion",
  "Stag", "Badger", "Lynx", "Mantis", "Vortex", "Nebula", "Comet", "Aurora"
];

function generateAnonymousName() {
  const noun = ANONYMOUS_NOUNS[Math.floor(Math.random() * ANONYMOUS_NOUNS.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${noun}${number}`;
}

module.exports = {
  validateSessionName,
  generateRandomSessionId,
  generateAnonymousName,
};

