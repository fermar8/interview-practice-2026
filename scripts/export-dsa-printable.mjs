import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COURSE_DIR = path.join(ROOT, "neetcode courses", "DSA for beginners");
const EXPORT_DIR = path.join(ROOT, "exports", "dsa-printable");
const WORK_DIR = path.join(EXPORT_DIR, "work");
const MASTER_MD = path.join(WORK_DIR, "master.md");
const MASTER_DOCX_MD = path.join(WORK_DIR, "master-docx.md");
const TEMP_PDF = path.join(WORK_DIR, "dsa-printable-pass1.pdf");
const FINAL_PDF = path.join(EXPORT_DIR, "DSA-for-beginners-printable.pdf");
const FINAL_DOCX = path.join(EXPORT_DIR, "DSA-for-beginners-printable.docx");
const HEADER_TEX = path.join(ROOT, "scripts", "print", "pdf-header.tex");
const LUA_FILTER = path.join(ROOT, "scripts", "print", "keep-with-next.lua");

const BLOCKS = [
  { number: 1, title: "Arrays", dir: "1. Arrays" },
  { number: 2, title: "Linked Lists", dir: "2. Linked Lists" },
  { number: 3, title: "Recursion", dir: "3.Recursion" },
  { number: 4, title: "Sorting", dir: "4.Sorting" },
  { number: 5, title: "Binary Search", dir: "5.Binary Search" },
  { number: 6, title: "Trees", dir: "6.Trees" }
];

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
    shell: false
  });
  return result.status === 0;
}

function detectPdfEngine() {
  const candidates = ["pdflatex", "xelatex", "lualatex"];
  for (const candidate of candidates) {
    if (commandWorks(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    [
      "No LaTeX PDF engine found (xelatex/lualatex/pdflatex).",
      "Install MiKTeX or TeX Live, then retry.",
      "MiKTeX: https://miktex.org/download"
    ].join(" ")
  );
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    windowsHide: true,
    shell: false
  });

  if (result.status !== 0) {
    const details = [
      `Command failed: ${command} ${args.join(" ")}`,
      result.stdout?.trim(),
      result.stderr?.trim()
    ]
      .filter(Boolean)
      .join("\n\n");

    throw new Error(details);
  }
}

function sortByNumericPrefix(fileNames) {
  return [...fileNames].sort((left, right) => {
    const leftMatch = left.match(/^(\d+)/);
    const rightMatch = right.match(/^(\d+)/);

    const leftNum = leftMatch ? Number(leftMatch[1]) : Number.POSITIVE_INFINITY;
    const rightNum = rightMatch ? Number(rightMatch[1]) : Number.POSITIVE_INFINITY;

    if (leftNum !== rightNum) {
      return leftNum - rightNum;
    }

    return left.localeCompare(right);
  });
}

function normalizePathForMarkdown(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join("/");
}

function normalizeImageLinks(markdownContent, blockAbsDir) {
  return markdownContent.replace(/\]\((images\/[^)]+)\)/g, (_match, imagePath) => {
    const absImagePath = path.join(blockAbsDir, imagePath);
    const relImagePath = normalizePathForMarkdown(absImagePath);
    return `](${relImagePath})`;
  });
}

function labelForBlock(block, suffix) {
  const slug = block.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `blk-${slug}-${suffix}`;
}

function buildCustomIndexLatex() {
  const rows = BLOCKS.map((block) => {
    const startLabel = labelForBlock(block, "start");
    const endLabel = labelForBlock(block, "end");
    return `${block.number}. ${block.title} & \\pageref{${startLabel}}--\\pageref{${endLabel}} \\\\`;
  }).join("\n");

  return [
    "\\newpage",
    "\\section*{Index By Block}",
    "\\addcontentsline{toc}{section}{Index By Block}",
    "\\begin{center}",
    "\\begin{tabular}{p{0.70\\linewidth}r}",
    "\\textbf{Block} & \\textbf{Page Range} \\\\",
    "\\hline",
    rows,
    "\\end{tabular}",
    "\\end{center}",
    "\\newpage"
  ].join("\n");
}

function buildDocxManualIndex() {
  const rows = BLOCKS.map((block) => `| ${block.number}. ${block.title} | ______ to ______ |`).join("\n");

  return [
    "# Index By Block",
    "",
    "Update the page ranges in Word after making your manual layout edits.",
    "",
    "| Block | Page Range |",
    "| --- | --- |",
    rows,
    ""
  ].join("\n");
}

function blankSeparatorPageLatex() {
  return ["\\newpage", "\\thispagestyle{empty}", "\\null", "\\newpage"].join("\n");
}

function blankSeparatorPageDocx() {
  return [
    "```{=openxml}",
    "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>",
    "<w:p/>",
    "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>",
    "```"
  ].join("\n");
}

function buildPdfMasterMarkdown() {
  ensureExists(COURSE_DIR, "Course directory");

  const today = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push("\\begin{titlepage}");
  lines.push("\\centering");
  lines.push("{\\Huge DSA for Beginners\\par}");
  lines.push("\\vspace{0.75cm}");
  lines.push("{\\Large Printable Study Booklet\\par}");
  lines.push("\\vfill");
  lines.push(`{\\large Generated on ${today}\\par}`);
  lines.push("\\end{titlepage}");
  lines.push("\\setcounter{page}{1}");
  lines.push("");
  lines.push(buildCustomIndexLatex());
  lines.push("");

  BLOCKS.forEach((block, blockIndex) => {
    const blockAbsDir = path.join(COURSE_DIR, block.dir);
    ensureExists(blockAbsDir, `Block directory for ${block.title}`);

    const markdownFiles = sortByNumericPrefix(
      fs
        .readdirSync(blockAbsDir)
        .filter((entry) => entry.toLowerCase().endsWith(".md"))
    );

    if (markdownFiles.length === 0) {
      throw new Error(`No markdown files found in block: ${blockAbsDir}`);
    }

    const startLabel = labelForBlock(block, "start");
    const endLabel = labelForBlock(block, "end");

    lines.push(`\\label{${startLabel}}`);
    lines.push(`# ${block.number}. ${block.title}`);
    lines.push("");

    for (const mdFile of markdownFiles) {
      const mdAbsPath = path.join(blockAbsDir, mdFile);
      const source = fs.readFileSync(mdAbsPath, "utf8");
      const normalizedSource = normalizeImageLinks(source, blockAbsDir);

      lines.push(`<!-- source: ${normalizePathForMarkdown(mdAbsPath)} -->`);
      lines.push(normalizedSource.trim());
      lines.push("");
    }

    lines.push(`\\label{${endLabel}}`);
    lines.push("");

    if (blockIndex < BLOCKS.length - 1) {
      lines.push(blankSeparatorPageLatex());
      lines.push("");
    }
  });

  return lines.join("\n");
}

function buildDocxMasterMarkdown() {
  ensureExists(COURSE_DIR, "Course directory");

  const today = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push("# DSA for Beginners");
  lines.push("");
  lines.push("Printable Study Booklet");
  lines.push("");
  lines.push(`Generated on ${today}`);
  lines.push("");
  lines.push(blankSeparatorPageDocx());
  lines.push("");
  lines.push(buildDocxManualIndex());
  lines.push("");
  lines.push(blankSeparatorPageDocx());
  lines.push("");

  BLOCKS.forEach((block, blockIndex) => {
    const blockAbsDir = path.join(COURSE_DIR, block.dir);
    ensureExists(blockAbsDir, `Block directory for ${block.title}`);

    const markdownFiles = sortByNumericPrefix(
      fs
        .readdirSync(blockAbsDir)
        .filter((entry) => entry.toLowerCase().endsWith(".md"))
    );

    if (markdownFiles.length === 0) {
      throw new Error(`No markdown files found in block: ${blockAbsDir}`);
    }

    lines.push(`# ${block.number}. ${block.title}`);
    lines.push("");

    for (const mdFile of markdownFiles) {
      const mdAbsPath = path.join(blockAbsDir, mdFile);
      const source = fs.readFileSync(mdAbsPath, "utf8");
      const normalizedSource = normalizeImageLinks(source, blockAbsDir);

      lines.push(`<!-- source: ${normalizePathForMarkdown(mdAbsPath)} -->`);
      lines.push(normalizedSource.trim());
      lines.push("");
    }

    if (blockIndex < BLOCKS.length - 1) {
      lines.push(blankSeparatorPageDocx());
      lines.push("");
    }
  });

  return lines.join("\n");
}

function runPandocPass(engine, inputPath, outputPath) {
  const args = [
    inputPath,
    "--from=markdown+raw_tex",
    "--standalone",
    "--toc",
    "--toc-depth=3",
    "--resource-path=.",
    `--pdf-engine=${engine}`,
    `--include-in-header=${HEADER_TEX}`,
    `--lua-filter=${LUA_FILTER}`,
    "-V",
    "geometry:margin=0.8in",
    "-V",
    "fontsize=11pt",
    "-V",
    "linestretch=1.15",
    "-o",
    outputPath
  ];

  runCommand("pandoc", args);
}

function runPandocDocx(inputPath, outputPath) {
  const args = [
    inputPath,
    "--from=markdown+raw_attribute+raw_html+raw_tex",
    "--standalone",
    "--toc",
    "--toc-depth=3",
    "--resource-path=.",
    "-o",
    outputPath
  ];

  runCommand("pandoc", args);
}

function resolveFormat() {
  const format = process.argv[2] ?? "pdf";

  if (!["pdf", "docx"].includes(format)) {
    throw new Error(`Unsupported export format: ${format}. Use 'pdf' or 'docx'.`);
  }

  return format;
}

function main() {
  if (!commandWorks("pandoc")) {
    throw new Error(
      [
        "Pandoc is not available on PATH.",
        "Install Pandoc from https://pandoc.org/installing.html and retry."
      ].join(" ")
    );
  }

  const format = resolveFormat();

  ensureDir(WORK_DIR);

  if (format === "docx") {
    const masterDocx = buildDocxMasterMarkdown();
    fs.writeFileSync(MASTER_DOCX_MD, masterDocx, "utf8");
    runPandocDocx(MASTER_DOCX_MD, FINAL_DOCX);
    console.log(`DOCX generated successfully: ${normalizePathForMarkdown(FINAL_DOCX)}`);
    return;
  }

  ensureExists(HEADER_TEX, "LaTeX header include file");
  ensureExists(LUA_FILTER, "Lua filter file");

  const pdfEngine = detectPdfEngine();

  const master = buildPdfMasterMarkdown();
  fs.writeFileSync(MASTER_MD, master, "utf8");

  // First pass resolves references and page anchors.
  runPandocPass(pdfEngine, MASTER_MD, TEMP_PDF);

  // Second pass stabilizes TOC and page references for final print.
  runPandocPass(pdfEngine, MASTER_MD, FINAL_PDF);

  console.log(`PDF generated successfully: ${normalizePathForMarkdown(FINAL_PDF)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
