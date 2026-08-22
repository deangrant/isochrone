import { describe, expect, it } from "vitest";
import { buildExcludeParam } from "@/utils/build-exclude-param";

describe("buildExcludeParam", () => {
  it("returns undefined when nothing is selected", () => {
    expect(buildExcludeParam([])).toBeUndefined();
  });

  it("returns a comma-separated list in option order", () => {
    expect(buildExcludeParam(["toll", "motorway"])).toBe("motorway,toll");
  });
});
