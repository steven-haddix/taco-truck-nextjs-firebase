import { calculateBarIndex } from ".";

it("should increment colors in a wave pattern", () => {
  expect(calculateBarIndex(0)).toBe(0);
  expect(calculateBarIndex(13)).toBe(10);
  expect(calculateBarIndex(25)).toBe(1);
});
