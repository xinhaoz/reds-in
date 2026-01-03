import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateSessionName(name: string): boolean {
  const regex = /^[a-zA-Z0-9_-]{3,50}$/;
  return regex.test(name);
}

export function generateRandomSessionId(): string {
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

export function generateAnonymousName(): string {
  const noun = ANONYMOUS_NOUNS[Math.floor(Math.random() * ANONYMOUS_NOUNS.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${noun}${number}`;
}

