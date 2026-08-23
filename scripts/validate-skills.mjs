#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const WEB_SRC = path.join(ROOT, "apps/web/src");

const COMPONENT_BARREL_PATTERN =
  /apps\/web\/src\/components\/(core|patterns|containers|layouts)\/index\.ts$/;
const LOOSE_HELPER_PATTERNS = [
  /apps\/web\/src\/components\/.*\/(helpers|row-actions)\.ts$/,
  /apps\/web\/src\/pages\/Reachability\/components\/.*\/(map-helpers|map-layers|row-actions|contour-exporters|contour-export-options|export-format-options)\.ts$/,
];
const EXPORT_FUNCTION_PATTERN =
  /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/;

const errors = [];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function rel(filePath) {
  return path.relative(ROOT, filePath);
}

function isTestFile(filePath) {
  return (
    filePath.includes(".test.") ||
    filePath.includes(".spec.") ||
    filePath.endsWith(`${path.sep}test${path.sep}setup.ts`)
  );
}

function hasIndexTsx(folder) {
  return existsSync(path.join(folder, "index.tsx"));
}

function validateNoComponentBarrels(files) {
  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (COMPONENT_BARREL_PATTERN.test(normalized)) {
      errors.push(`${rel(file)}: component layer barrel files are forbidden`);
    }
  }
}

function validateComponentFolderRoot(root) {
  if (!existsSync(root)) {
    return;
  }

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const folder = path.join(root, entry.name);
    if (!hasIndexTsx(folder)) {
      errors.push(`${rel(folder)}: missing index.tsx`);
    }
  }
}

function validateComponentFolders() {
  validateComponentFolderRoot(path.join(WEB_SRC, "components", "core"));
  validateComponentFolderRoot(path.join(WEB_SRC, "components", "patterns"));
  validateComponentFolderRoot(
    path.join(WEB_SRC, "pages", "Reachability", "components"),
  );
}

function validateServiceNaming(files) {
  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (!normalized.includes("/apps/web/src/services/")) {
      continue;
    }
    if (!normalized.endsWith(".ts") || normalized.endsWith(".test.ts")) {
      continue;
    }

    const base = path.basename(file);
    if (base === "app-services.ts" || base.endsWith("-service.ts")) {
      continue;
    }

    errors.push(`${rel(file)}: service files must end with -service.ts`);
  }
}

function validateForbiddenSharedComponents() {
  const forbidden = [
    "apps/web/src/components/core/TravelModeIcon",
    "apps/web/src/components/patterns/LocationSearch",
  ];

  for (const fragment of forbidden) {
    if (existsSync(path.join(ROOT, fragment))) {
      errors.push(
        `${fragment}: page-only component must not live in shared components/`,
      );
    }
  }
}

function validateLooseHelpers(files) {
  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (isTestFile(normalized)) {
      continue;
    }

    for (const pattern of LOOSE_HELPER_PATTERNS) {
      if (pattern.test(normalized)) {
        errors.push(`${rel(file)}: loose helper must live in utils/`);
      }
    }
  }
}

function exportedFunctionHasJSDoc(lines, index) {
  for (let lookback = index - 1; lookback >= 0; lookback -= 1) {
    const previous = lines[lookback].trim();
    if (previous === "") {
      continue;
    }

    return previous.endsWith("*/");
  }

  return false;
}

function validateExportedFunctionJSDocInFile(file) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(EXPORT_FUNCTION_PATTERN);
    if (!(match && line.startsWith("export"))) {
      continue;
    }

    if (!exportedFunctionHasJSDoc(lines, index)) {
      errors.push(
        `${rel(file)}:${index + 1}: exported function ${match[1]} missing JSDoc`,
      );
    }
  }
}

function validateExportedFunctionJSDoc(files) {
  for (const file of files) {
    if (
      !file.endsWith(".ts") ||
      isTestFile(file) ||
      file.endsWith(".types.ts")
    ) {
      continue;
    }

    validateExportedFunctionJSDocInFile(file);
  }
}

function validateForbiddenConfigFolder(files) {
  for (const file of files) {
    const normalized = file.replaceAll("\\", "/");
    if (normalized.includes("/apps/web/src/config/")) {
      errors.push(`${rel(file)}: use constants/ instead of config/`);
    }
  }
}

function main() {
  const files = walk(WEB_SRC);

  validateNoComponentBarrels(files);
  validateComponentFolders();
  validateServiceNaming(files);
  validateForbiddenSharedComponents();
  validateLooseHelpers(files);
  validateExportedFunctionJSDoc(files);
  validateForbiddenConfigFolder(files);

  if (errors.length > 0) {
    console.error("validate-skills failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("validate-skills passed");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
