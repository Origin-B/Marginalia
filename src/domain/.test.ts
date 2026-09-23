import { describe, it, expect } from "vitest";
import progressCalc from "./progressCalc";

describe("calculateProgress domain logic", () => {
  it("should calculate the correct percentage", () => {
    expect(progressCalc(50, 200)).toBe(25);
  });

  it("should handle zero total pages without crashing", () => {
    expect(progressCalc(10, 0)).toBe(0);
  });

  it("should cap progress at 100 if current page exceeds total", () => {
    expect(progressCalc(120, 100)).toBe(0);
  });

  it("should handle negative current pages gracefully", () => {
    expect(progressCalc(-5, 100)).toBe(0);
  });
});
