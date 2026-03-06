"use strict";

const { mkdir, appendFile } = require("node:fs/promises");
const path = require("node:path");

async function persistSubmission(record, storePath) {
  if (!storePath) {
    return { ok: true, skipped: true };
  }

  const targetPath = path.resolve(storePath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await appendFile(targetPath, `${JSON.stringify(record)}\n`, "utf8");
  return { ok: true, path: targetPath };
}

module.exports = {
  persistSubmission
};
