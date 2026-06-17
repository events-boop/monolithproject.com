import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const explicitEnvKeys = new Set(Object.keys(process.env));

function parseUnquotedValue(value) {
  let parsed = value.trimEnd();

  for (let index = 0; index < parsed.length; index += 1) {
    if (parsed[index] === "#" && (index === 0 || /\s/.test(parsed[index - 1]))) {
      parsed = parsed.slice(0, index).trimEnd();
      break;
    }
  }

  return parsed.trim();
}

function parseDoubleQuotedValue(value) {
  let parsed = "";
  let escaped = false;

  for (let index = 1; index < value.length; index += 1) {
    const character = value[index];

    if (escaped) {
      if (character === "n") parsed += "\n";
      else if (character === "r") parsed += "\r";
      else if (character === "t") parsed += "\t";
      else parsed += character;
      escaped = false;
      continue;
    }

    if (character === "\\") {
      escaped = true;
      continue;
    }

    if (character === "\"") {
      break;
    }

    parsed += character;
  }

  return parsed;
}

function parseSingleQuotedValue(value) {
  const closingQuoteIndex = value.indexOf("'", 1);
  if (closingQuoteIndex === -1) return value.slice(1);
  return value.slice(1, closingQuoteIndex);
}

function parseEnvFile(contents) {
  const parsed = new Map();

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(
      line
    );
    if (!match) continue;

    const [, key, rawValue] = match;
    const value = rawValue.trimStart();

    if (value.startsWith("\"")) {
      parsed.set(key, parseDoubleQuotedValue(value));
    } else if (value.startsWith("'")) {
      parsed.set(key, parseSingleQuotedValue(value));
    } else {
      parsed.set(key, parseUnquotedValue(value));
    }
  }

  return parsed;
}

function loadEnvFile(filename, { overrideLoadedValues = false } = {}) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) return;

  const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));

  for (const [key, value] of parsed) {
    if (explicitEnvKeys.has(key)) continue;
    if (overrideLoadedValues || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local", { overrideLoadedValues: true });
