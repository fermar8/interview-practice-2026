import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "interview-preparation-october");
const EXPORT_DIR = path.join(ROOT, "exports", "interview-preparation-october");
const WORK_DIR = path.join(EXPORT_DIR, "work");
const TEMP_MD = path.join(WORK_DIR, "interview-preparation-october-master.md");
const FINAL_DOCX = path.join(EXPORT_DIR, "interview-preparation-october-printable.docx");

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

function sortByNumericPrefix(filePaths) {
  return [...filePaths].sort((left, right) => {
    const leftName = path.basename(left);
    const rightName = path.basename(right);

    const leftMatch = leftName.match(/^(\d+)/);
    const rightMatch = rightName.match(/^(\d+)/);

    const leftNum = leftMatch ? Number(leftMatch[1]) : Number.POSITIVE_INFINITY;
    const rightNum = rightMatch ? Number(rightMatch[1]) : Number.POSITIVE_INFINITY;

    if (leftNum !== rightNum) {
      return leftNum - rightNum;
    }

    return leftName.localeCompare(rightName);
  });
}

function separatorPageDocx() {
  return [
    "```{=openxml}",
    "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>",
    "```",
  ].join("\n");
}

function buildMasterMarkdown(files) {
  const lines = [];

  lines.push("# Interview Preparation - October");
  lines.push("");
  lines.push("Printable study notes");
  lines.push("");
  lines.push("## Table of Contents");
  lines.push("");

  for (const file of files) {
    const title = path.basename(file, ".md").replace(/^\d+\.?\s*/, "");
    lines.push(`- ${title}`);
  }

  lines.push("");
  lines.push(separatorPageDocx());
  lines.push("");

  for (const [index, file] of files.entries()) {
    const source = fs.readFileSync(file, "utf8");
    const fileName = path.basename(file, ".md");

    lines.push(`# ${fileName}`);
    lines.push("");
    lines.push(source.trim());
    lines.push("");

    if (index < files.length - 1) {
      lines.push(separatorPageDocx());
      lines.push("");
    }
  }

  return lines.join("\n");
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
  ensureExists(SOURCE_DIR, "Source Markdown directory");

  if (!commandWorks("pandoc")) {
    throw new Error(
      [
        "Pandoc is not available on PATH.",
        "Install Pandoc from https://pandoc.org/installing.html and retry.",
      ].join(" "),
    );
  }

  ensureDir(WORK_DIR);

  const files = sortByNumericPrefix(
    fs
      .readdirSync(SOURCE_DIR)
      .filter((entry) => entry.toLowerCase().endsWith(".md"))
      .map((entry) => path.join(SOURCE_DIR, entry)),
  );

  if (files.length === 0) {
    throw new Error(`No markdown files found in ${SOURCE_DIR}`);
  }

  const masterMarkdown = buildMasterMarkdown(files);
  fs.writeFileSync(TEMP_MD, masterMarkdown, "utf8");

  runPandoc(TEMP_MD, FINAL_DOCX);

  console.log(`DOCX generated successfully: ${FINAL_DOCX}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
