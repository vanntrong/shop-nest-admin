const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

const buildPrettierCommand = (filenames) =>
  `prettier --ignore-path .gitignore --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`;

const buildTypeCheckCommand = () => "tsc --pretty --noEmit";

const buildGitAddCommand = (filenames) =>
  `git add ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    buildEslintCommand,
    buildPrettierCommand,
    buildGitAddCommand,
  ],
  "*.{js,jsx,ts,tsx,md,html,css}": [buildPrettierCommand, buildGitAddCommand],
  "*.{ts,tsx}": [buildTypeCheckCommand, buildGitAddCommand],
};
