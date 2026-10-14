import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SOURCE_MD = path.join(
  ROOT,
  "x-team-preparation",
  "3.global-study-notes.md",
);
const EXPORT_DIR = path.join(ROOT, "exports", "sre-study-notes");
const WORK_DIR = path.join(EXPORT_DIR, "work");
const TEMP_MD = path.join(WORK_DIR, "global-study-notes-prep.md");
const FINAL_DOCX = path.join(EXPORT_DIR, "global-study-notes-prep.docx");

function ensureExists(targetPath, description) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${description} not found: ${targetPath}`);
  }
}

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function commandWorks(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
    shell: false,
  });

  return result.status === 0;
}

function runPandoc(inputPath, outputPath) {
  const args = [
    inputPath,
    "--from=markdown+raw_attribute+raw_html+raw_tex",
    "--standalone",
    "--toc",
    "--toc-depth=3",
    "--resource-path=.",
    "-o",
    outputPath,
  ];

  const result = spawnSync("pandoc", args, {
    cwd: ROOT,
    encoding: "utf8",
    windowsHide: true,
    shell: false,
  });

  if (result.status !== 0) {
    const details = [
      "Pandoc conversion failed.",
      result.stdout?.trim(),
      result.stderr?.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    throw new Error(details);
  }
}

function main() {
  ensureExists(SOURCE_MD, "Source Markdown document");

  if (!commandWorks("pandoc")) {
    throw new Error(
      [
        "Pandoc is not available on PATH.",
        "Install Pandoc from https://pandoc.org/installing.html and retry.",
      ].join(" "),
    );
  }

  ensureDir(WORK_DIR);

  const sourceContent = fs.readFileSync(SOURCE_MD, "utf8");
  fs.writeFileSync(TEMP_MD, sourceContent, "utf8");

  runPandoc(TEMP_MD, FINAL_DOCX);

  console.log(`DOCX generated successfully: ${FINAL_DOCX}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
