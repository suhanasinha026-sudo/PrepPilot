/**
 * Global Branding & Accessibility Modernization Script for EduPrep Screens
 * - Replaces all visible EduVantage / GradPrep branding with EduPrep across HTML screens
 * - Updates script references to ../shared/eduprep_data.js
 * - Adds prefers-reduced-motion CSS support to revision_flashcards/code.html
 */

const fs = require("fs");
const path = require("path");

const eduPrepRoot = path.join(__dirname, "..", "EduPrep");

function getAllHtmlFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(full, acc);
    } else if (entry.name.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

const htmlFiles = getAllHtmlFiles(eduPrepRoot);
let updatedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // 1. Update script src to eduprep_data.js
  content = content.replace(/\.\.\/shared\/eduvantage_data\.js/g, "../shared/eduprep_data.js");
  content = content.replace(/shared\/eduvantage_data\.js/g, "shared/eduprep_data.js");

  // 2. Replace visible branding and identifiers
  content = content.replace(/EduVantage/g, "EduPrep");
  content = content.replace(/Eduvantage/g, "EduPrep");
  content = content.replace(/EDUVANTAGE/g, "EDUPREP");
  content = content.replace(/GradPrep/g, "EduPrep");
  content = content.replace(/gradprep/g, "eduprep");
  content = content.replace(/eduvantage\.app/g, "eduprep.app");
  content = content.replace(/>EV</g, ">EP<");

  // 3. Ensure prefers-reduced-motion in revision_flashcards
  if (filePath.includes("revision_flashcards") && !content.includes("prefers-reduced-motion")) {
    content = content.replace(
      "</style>",
      `  @media (prefers-reduced-motion: reduce) {\n      .card-inner { transition: none !important; }\n    }\n  </style>`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    updatedCount++;
    console.log("Updated:", path.relative(eduPrepRoot, filePath));
  }
}

console.log(`Processed ${htmlFiles.length} HTML files (${updatedCount} modified).`);
