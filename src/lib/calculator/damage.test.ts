import { describe, expect, it } from "vitest";
import {
  calcPartyOrderAgility,
  calcPhysicalDamage,
  calcRequiredAgilityToActBefore,
} from "./damage";

describe("calcPhysicalDamage", () => {
  it("computes basic physical damage", () => {
    const result = calcPhysicalDamage({
      attack: 1000,
      defense: 400,
      skillMultiplier: 280,
      elementDamagePercent: 25,
      familyDamagePercent: 10,
      attackTypeDamagePercent: 15,
    });

    expect(result.baseDamage).toBe(400);
    expect(result.perHit).toBeGreaterThan(0);
  });

  it("returns zero when base damage is non-positive", () => {
    const result = calcPhysicalDamage({
      attack: 100,
      defense: 400,
      skillMultiplier: 100,
    });
    expect(result.perHit).toBe(0);
  });
});

describe("speed calculations", () => {
  it("requires 115% agility for normal content", () => {
    expect(calcRequiredAgilityToActBefore(1000, "hokora")).toBe(1160);
  });

  it("requires 120% agility for megamon", () => {
    expect(calcRequiredAgilityToActBefore(1000, "megamon")).toBe(1210);
  });

  it("chains party order agility", () => {
    const slot4 = 800;
    const slot3 = calcPartyOrderAgility(slot4, "megamon");
    const slot2 = calcPartyOrderAgility(slot3, "megamon");
    expect(slot3).toBeGreaterThan(slot4);
    expect(slot2).toBeGreaterThan(slot3);
  });
});
