const assert = require("node:assert/strict");
const EduPrep = require("../EduPrep/shared/eduprep_data.js");
const ChaptersEngine = require("../EduPrep/shared/eduprep_chapters_data.js");

console.log("=== RUNNING SEARCH & STREAM REGRESSION VERIFICATION ===");

// 1. Search checks
const searchTerms = [
  "Engineering Mathematics",
  "Operating Systems",
  "Database Management Systems",
  "Anatomy",
  "Physiology",
  "Financial Accounting",
  "Business Law",
  "English Literature",
  "Psychology"
];

for (const term of searchTerms) {
  const res = EduPrep.searchCurriculum(term);
  assert.ok(res.subjects.length > 0, `Search for "${term}" must find subject`);
  console.log(`✔ Search for "${term}": Found subject "${res.subjects[0].name}" in stream "${res.subjects[0].stream}"`);
}

// Chapter/Topic search checks
const chapterSearchTerms = ["Matrices", "Deadlock", "Cardiovascular", "Transport", "Neuroanatomy", "Thoracic"];
for (const term of chapterSearchTerms) {
  const res = EduPrep.searchCurriculum(term);
  const found = res.chapters.length > 0 || res.subjects.some(s => s.chapters && s.chapters.some(c => c.title.toLowerCase().includes(term.toLowerCase())));
  assert.ok(found, `Search for chapter/topic "${term}" must find results`);
  console.log(`✔ Search for chapter/topic "${term}": Found ${res.chapters.length} chapter matches`);
}

// 2. Stream checks
const streams = ["engineering", "medical", "commerce", "arts"];
for (const st of streams) {
  const subjs = EduPrep.getStreamSubjects(st);
  assert.ok(subjs && subjs.length > 0, `Stream ${st} must return subjects`);
  console.log(`✔ Stream "${st}": Loaded ${subjs.length} subjects`);
}

console.log("ALL SEARCH & STREAM REGRESSIONS PASSED SUCCESSFULLY!");
