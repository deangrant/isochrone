import { describe, expect, it } from "vitest";
import { buildWktFilename } from "@/pages/Reachability/services/wkt-download-service";

const WKT_FILENAME_PATTERN = /^reachability-.+\.wkt$/;

describe("wkt-download-service", () => {
  it("builds a timestamped filename", () => {
    expect(buildWktFilename()).toMatch(WKT_FILENAME_PATTERN);
  });
});
