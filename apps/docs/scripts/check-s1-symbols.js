#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m"
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findHtmlFiles(dir) {
  const files = [];

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (!["node_modules", ".git", "pagefind"].includes(item)) {
          scan(fullPath);
        }
      } else if (item.endsWith(".html")) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

function analyzeHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const results = {
    file: filePath,
    hasS1: false,
    s1Locations: [],
    qrlReferences: [],
    runReferences: [],
    scriptBlocks: [],
    suspiciousPatterns: []
  };

  // Check for actual problematic s1 symbol references (not just "s1" substrings)
  const problematicS1Patterns = [
    /[^a-zA-Z0-9_]s1[^a-zA-Z0-9_]/g, // s1 as standalone symbol
    /["']s1["']/g, // "s1" or 's1' as string
    /\.js#s1[\]\s"']/g, // QRL reference ending with s1
    /Cannot\s+resolve\s+symbol\s+s1/gi // Error message
  ];

  problematicS1Patterns.forEach((pattern) => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach((match) => {
      results.hasS1 = true;
      const start = Math.max(0, match.index - 50);
      const end = Math.min(content.length, match.index + 50);
      const context = content.substring(start, end);
      results.s1Locations.push({
        index: match.index,
        context: context.replace(/\n/g, "\\n"),
        pattern: pattern.source
      });
    });
  });

  // Check for QRL references (q-*.js#*)
  const qrlPattern = /q-[A-Za-z0-9]+\.js#[^"\s\]]+/g;
  const qrlMatches = [...content.matchAll(qrlPattern)];
  results.qrlReferences = qrlMatches.map((match) => ({
    qrl: match[0],
    index: match.index,
    context: content.substring(
      Math.max(0, match.index - 30),
      Math.min(content.length, match.index + 80)
    )
  }));

  // Check for _run references
  const runPattern = /_run(\[[0-9]+\])?/g;
  const runMatches = [...content.matchAll(runPattern)];
  results.runReferences = runMatches.map((match) => ({
    reference: match[0],
    index: match.index,
    context: content.substring(
      Math.max(0, match.index - 30),
      Math.min(content.length, match.index + 80)
    )
  }));

  // Extract script blocks (especially qwik state and vnode scripts)
  const scriptPattern = /<script[^>]*>(.*?)<\/script>/gs;
  const scriptMatches = [...content.matchAll(scriptPattern)];
  results.scriptBlocks = scriptMatches.map((match, index) => ({
    id: index,
    attributes: match[0].substring(0, match[0].indexOf(">")),
    content: match[1].substring(0, 200) + (match[1].length > 200 ? "..." : ""),
    fullLength: match[1].length,
    hasS1: match[1].includes("s1"),
    hasRun: match[1].includes("_run")
  }));

  // Look for suspicious patterns that might be related to symbol resolution
  const suspiciousPatterns = [
    { name: "Array access with numbers", pattern: /\[[0-9]+\]/g },
    { name: "Short symbol references", pattern: /["']s[0-9]["']/g },
    { name: "QRL with brackets", pattern: /\.js#[^"'\s\]]*\[[^\]]*\]/g },
    { name: "Symbol resolution errors", pattern: /cannot\s+resolve\s+symbol/gi }
  ];

  suspiciousPatterns.forEach(({ name, pattern }) => {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      results.suspiciousPatterns.push({
        name,
        count: matches.length,
        examples: matches.slice(0, 3).map((match) => ({
          text: match[0],
          context: content.substring(
            Math.max(0, match.index - 20),
            Math.min(content.length, match.index + 40)
          )
        }))
      });
    }
  });

  return results;
}

function main() {
  log("\n🔍 ADVANCED S1 SYMBOL ANALYSIS", "bold");
  log("=====================================", "cyan");

  const distPath = path.join(__dirname, "../dist");

  if (!fs.existsSync(distPath)) {
    log("❌ dist directory not found!", "red");
    log(`   Expected: ${distPath}`, "yellow");
    process.exit(1);
  }

  log(`📁 Scanning: ${distPath}`, "blue");

  const htmlFiles = findHtmlFiles(distPath);
  log(`📄 Found ${htmlFiles.length} HTML files`, "green");

  let totalS1Found = 0;
  let filesWithS1 = 0;
  const detailedResults = [];

  htmlFiles.forEach((file) => {
    const result = analyzeHtmlFile(file);
    detailedResults.push(result);

    if (result.hasS1) {
      totalS1Found += result.s1Locations.length;
      filesWithS1++;
    }
  });

  // Summary Report
  log("\n📊 SUMMARY REPORT", "bold");
  log(
    `Files with s1 references: ${filesWithS1}/${htmlFiles.length}`,
    filesWithS1 > 0 ? "red" : "green"
  );
  log(`Total s1 occurrences: ${totalS1Found}`, totalS1Found > 0 ? "red" : "green");

  // Detailed findings
  if (filesWithS1 > 0) {
    log("\n🚨 FILES WITH S1 REFERENCES:", "red");
    detailedResults
      .filter((r) => r.hasS1)
      .forEach((result) => {
        log(`\n📄 ${path.relative(distPath, result.file)}`, "yellow");
        result.s1Locations.forEach((loc, index) => {
          log(`   ${index + 1}. Position ${loc.index}:`, "magenta");
          log(`      Context: ${loc.context}`, "cyan");
        });
      });
  }

  // QRL Analysis
  const allQrls = detailedResults.flatMap((r) => r.qrlReferences);
  if (allQrls.length > 0) {
    log("\n🔗 QRL REFERENCES ANALYSIS:", "blue");
    log(`Total QRLs found: ${allQrls.length}`, "cyan");

    // Group by QRL pattern
    const qrlGroups = {};
    allQrls.forEach((qrl) => {
      const key = qrl.qrl;
      qrlGroups[key] = (qrlGroups[key] || 0) + 1;
    });

    Object.entries(qrlGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([qrl, count]) => {
        log(`   ${count}x: ${qrl}`, "cyan");
      });
  }

  // _run Analysis
  const allRunRefs = detailedResults.flatMap((r) => r.runReferences);
  if (allRunRefs.length > 0) {
    log("\n🏃 _RUN REFERENCES ANALYSIS:", "green");
    log(`Total _run references: ${allRunRefs.length}`, "cyan");

    allRunRefs.forEach((ref) => {
      log(`   ${ref.reference} at position ${ref.index}`, "cyan");
      log(`      Context: ${ref.context.replace(/\n/g, "\\n")}`, "yellow");
    });
  }

  // Script blocks analysis
  const scriptsWithS1 = detailedResults.flatMap((r) =>
    r.scriptBlocks.filter((s) => s.hasS1)
  );
  if (scriptsWithS1.length > 0) {
    log("\n📜 SCRIPT BLOCKS WITH S1:", "red");
    scriptsWithS1.forEach((script) => {
      log(`   Script ${script.id}: ${script.attributes}`, "magenta");
      log(`      Length: ${script.fullLength} chars`, "cyan");
      log(`      Preview: ${script.content}`, "yellow");
    });
  }

  // Suspicious patterns
  const allSuspicious = detailedResults.flatMap((r) => r.suspiciousPatterns);
  if (allSuspicious.length > 0) {
    log("\n⚠️  SUSPICIOUS PATTERNS:", "yellow");
    const patternGroups = {};
    allSuspicious.forEach((pattern) => {
      const key = pattern.name;
      if (!patternGroups[key]) {
        patternGroups[key] = { count: 0, examples: [] };
      }
      patternGroups[key].count += pattern.count;
      patternGroups[key].examples.push(...pattern.examples);
    });

    Object.entries(patternGroups).forEach(([name, data]) => {
      log(`   ${name}: ${data.count} occurrences`, "cyan");
      data.examples.slice(0, 2).forEach((example) => {
        log(`      "${example.text}" in: ${example.context}`, "yellow");
      });
    });
  }

  // Environment info
  log("\n🌍 ENVIRONMENT INFO:", "blue");
  log(`   Node.js: ${process.version}`, "cyan");
  log(`   Platform: ${process.platform}`, "cyan");
  log(
    `   Cloudflare Pages: ${process.env.CF_PAGES ? "YES" : "NO"}`,
    process.env.CF_PAGES ? "green" : "yellow"
  );
  if (process.env.CF_PAGES) {
    log(`   CF Commit: ${process.env.CF_PAGES_COMMIT_SHA || "unknown"}`, "cyan");
    log(`   CF Branch: ${process.env.CF_PAGES_BRANCH || "unknown"}`, "cyan");
  }

  log("\n✅ Analysis complete!", "green");

  // Exit with error code if s1 found
  if (totalS1Found > 0) {
    log("\n💥 s1 symbols detected - this might indicate the build issue!", "red");
    process.exit(1);
  }
}

main();
