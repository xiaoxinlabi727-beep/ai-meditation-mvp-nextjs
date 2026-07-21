import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "mock-db.json");
const emptyDb = {
  submissions: [],
  generations: []
};

function createEmptyDb() {
  return {
    submissions: [],
    generations: []
  };
}

function ensureDb() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2), "utf8");
    }

    return true;
  } catch {
    return false;
  }
}

function readDb() {
  if (!ensureDb()) {
    return createEmptyDb();
  }

  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    return createEmptyDb();
  }
}

function writeDb(data) {
  if (!ensureDb()) {
    return false;
  }

  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveSubmission(surveyData) {
  const db = readDb();
  const submission = {
    id: createId("sub"),
    surveyData,
    createdAt: new Date().toISOString()
  };
  db.submissions.push(submission);
  writeDb(db);
  return submission;
}

export function getSubmission(submissionId) {
  const db = readDb();
  return db.submissions.find((item) => item.id === submissionId) || null;
}

export function saveGeneration(payload) {
  const db = readDb();
  const generation = {
    id: createId("gen"),
    ...payload,
    createdAt: new Date().toISOString()
  };
  db.generations.push(generation);
  writeDb(db);
  return generation;
}
