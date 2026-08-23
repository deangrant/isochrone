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
const EXPORT_INTERFACE_PATTERN = /^export\s+interface\s+([A-Za-z0-9_]+)/;
const EXPORT_TYPE_PATTERN = /^export\s+type\s+([A-Za-z0-9_]+)/;
const EXPORT_CLASS_PATTERN = /^export\s+class\s+([A-Za-z0-9_]+)/;
const EXPORT_CONST_PATTERN = /^export\s+const\s+([A-Za-z0-9_]+)/;
const COMPONENT_TYPES_IMPORT_PATTERN =
  /from\s+["'][^"']*\/components\/[^"']+\/index\.types["']/;
const MULTILINE_BLOCK_COMMENT_PATTERN = /\/\*(?!\*)/;
const CALLED_WHEN_PATTERN = /Called when/i;
const TEST_FILE_SUFFIX_PATTERN = /\.test\.ts$/;

const TOP_LEVEL_CONSTANTS_ALLOWLIST = new Set(["mapbox.constants.ts"]);
const TOP_LEVEL_UTILS_ALLOWLIST = new Set([
  "datetime-local.ts",
  "datetime-picker.ts",
]);
const FORBIDDEN_TOP_LEVEL_CONSTANT_PATTERNS = [
  /^reachability-/,
  /^travel-modes/,
  /^exclude-options/,
  /^contour/,
  /^contours\.constants/,
  /^api\.constants/,
];
const REACHABILITY_EXPORT_SERVICES = [
  "geojson-download-service.ts",
  "wkt-download-service.ts",
];

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

function normalize(filePath) {
  return filePath.replaceAll("\\", "/");
}

function isTestFile(filePath) {
  const normalized = normalize(filePath);
  return (
    normalized.includes(".test.") ||
    normalized.includes(".spec.") ||
    normalized.endsWith("/test/setup.ts")
  );
}

function hasIndexTsx(folder) {
  return existsSync(path.join(folder, "index.tsx"));
}

function validateNoComponentBarrels(files) {
  for (const file of files) {
    const normalized = normalize(file);
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
    const normalized = normalize(file);
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

function validateReachabilityExportServices(files) {
  for (const file of files) {
    const normalized = normalize(file);
    if (!normalized.includes("/apps/web/src/services/")) {
      continue;
    }

    const base = path.basename(file);
    if (REACHABILITY_EXPORT_SERVICES.includes(base)) {
      errors.push(
        `${rel(file)}: reachability export services must live under pages/Reachability/services/`,
      );
    }
  }

  for (const serviceName of REACHABILITY_EXPORT_SERVICES) {
    const expected = path.join(
      WEB_SRC,
      "pages",
      "Reachability",
      "services",
      serviceName,
    );
    if (!existsSync(expected)) {
      errors.push(
        `${rel(expected)}: missing reachability export service module`,
      );
    }
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
    const normalized = normalize(file);
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

function exportedSymbolHasJSDoc(lines, index) {
  for (let lookback = index - 1; lookback >= 0; lookback -= 1) {
    const previous = lines[lookback].trim();
    if (previous === "") {
      continue;
    }

    return previous.endsWith("*/");
  }

  return false;
}

function validateExportedSymbolJSDocInFile(file) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  const patterns = [
    EXPORT_FUNCTION_PATTERN,
    EXPORT_INTERFACE_PATTERN,
    EXPORT_TYPE_PATTERN,
    EXPORT_CLASS_PATTERN,
    EXPORT_CONST_PATTERN,
  ];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("export")) {
      continue;
    }

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (!match) {
        continue;
      }

      if (!exportedSymbolHasJSDoc(lines, index)) {
        errors.push(
          `${rel(file)}:${index + 1}: exported symbol ${match[1]} missing JSDoc`,
        );
      }
      break;
    }
  }
}

function validateExportedSymbolJSDoc(files) {
  for (const file of files) {
    if (
      !file.endsWith(".ts") ||
      isTestFile(file) ||
      file.endsWith(".types.ts")
    ) {
      continue;
    }

    validateExportedSymbolJSDocInFile(file);
  }
}

function validateForbiddenConfigFolder(files) {
  for (const file of files) {
    const normalized = normalize(file);
    if (normalized.includes("/apps/web/src/config/")) {
      errors.push(`${rel(file)}: use constants/ instead of config/`);
    }
  }
}

function validateNoUiInConstants(files) {
  for (const file of files) {
    const normalized = normalize(file);
    if (
      normalized.includes("/apps/web/src/constants/") &&
      normalized.endsWith(".tsx")
    ) {
      errors.push(`${rel(file)}: constants/ must not contain UI (.tsx)`);
    }
  }
}

function validateTopLevelConstantsAllowlist() {
  const constantsDir = path.join(WEB_SRC, "constants");
  if (!existsSync(constantsDir)) {
    return;
  }

  for (const entry of readdirSync(constantsDir, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }

    const base = entry.name;
    if (isTestFile(base)) {
      continue;
    }

    if (!TOP_LEVEL_CONSTANTS_ALLOWLIST.has(base)) {
      errors.push(
        `${rel(path.join(constantsDir, base))}: top-level constants/ is limited to mapbox.constants.ts; move page-only constants under pages/<Page>/constants/`,
      );
    }

    for (const pattern of FORBIDDEN_TOP_LEVEL_CONSTANT_PATTERNS) {
      if (pattern.test(base)) {
        errors.push(
          `${rel(path.join(constantsDir, base))}: reachability constants must live under pages/Reachability/constants/`,
        );
      }
    }
  }
}

function validateTopLevelUtilsAllowlist() {
  const utilsDir = path.join(WEB_SRC, "utils");
  if (!existsSync(utilsDir)) {
    return;
  }

  for (const entry of readdirSync(utilsDir, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }

    const base = entry.name;
    if (isTestFile(base)) {
      const sourceName = base.replace(TEST_FILE_SUFFIX_PATTERN, ".ts");
      if (!TOP_LEVEL_UTILS_ALLOWLIST.has(sourceName)) {
        errors.push(
          `${rel(path.join(utilsDir, base))}: test file has no allowed top-level utils source`,
        );
      }
      continue;
    }

    if (!TOP_LEVEL_UTILS_ALLOWLIST.has(base)) {
      errors.push(
        `${rel(path.join(utilsDir, base))}: top-level utils/ is limited to shared DateTimePicker helpers; move page-only helpers under pages/<Page>/utils/`,
      );
    }
  }
}

function validateLayerInversion(files) {
  for (const file of files) {
    const normalized = normalize(file);
    if (
      !(
        normalized.includes("/apps/web/src/utils/") ||
        normalized.includes("/apps/web/src/constants/")
      )
    ) {
      continue;
    }

    const content = readFileSync(file, "utf8");
    if (COMPONENT_TYPES_IMPORT_PATTERN.test(content)) {
      errors.push(
        `${rel(file)}: utils/ and constants/ must not import component index.types`,
      );
    }
  }
}

function validateNoMultilineBlockComments(files) {
  for (const file of files) {
    if (!(file.endsWith(".ts") || file.endsWith(".tsx")) || isTestFile(file)) {
      continue;
    }

    const content = readFileSync(file, "utf8");
    const withoutJSDoc = content.replace(/\/\*\*[\s\S]*?\*\//g, "");
    if (MULTILINE_BLOCK_COMMENT_PATTERN.test(withoutJSDoc)) {
      errors.push(
        `${rel(file)}: use repeated // line comments instead of /* */ blocks`,
      );
    }
  }
}

function validateCallbackVoiceInTypes(files) {
  for (const file of files) {
    if (!file.endsWith(".types.ts") || isTestFile(file)) {
      continue;
    }

    const content = readFileSync(file, "utf8");
    if (CALLED_WHEN_PATTERN.test(content)) {
      errors.push(
        `${rel(file)}: callback JSDoc must use third-person verb phrases, not "Called when"`,
      );
    }
  }
}

function main() {
  const files = walk(WEB_SRC);

  validateNoComponentBarrels(files);
  validateComponentFolders();
  validateServiceNaming(files);
  validateReachabilityExportServices(files);
  validateForbiddenSharedComponents();
  validateLooseHelpers(files);
  validateExportedSymbolJSDoc(files);
  validateForbiddenConfigFolder(files);
  validateNoUiInConstants(files);
  validateTopLevelConstantsAllowlist();
  validateTopLevelUtilsAllowlist();
  validateLayerInversion(files);
  validateNoMultilineBlockComments(files);
  validateCallbackVoiceInTypes(files);

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
