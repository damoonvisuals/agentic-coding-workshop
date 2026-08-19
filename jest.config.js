const nextJest = require("next/jest");

// Load next.config.js and .env files, and use Next's SWC transform for TS/TSX
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  clearMocks: true,
  watchman: false,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};

module.exports = createJestConfig(config);
