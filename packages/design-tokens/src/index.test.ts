import { describe, expect, it } from "vitest";

import { theme } from "./index";

describe("WhiteRabbit theme contract", () => {
  it("exposes one light appearance", () => {
    expect(theme.appearance).toBe("light");
    expect(theme).not.toHaveProperty("dark");
    expect(theme).not.toHaveProperty("system");
  });

  it("keeps operational statuses independent from color", () => {
    expect(theme.status.healthy.label).toBe("Healthy");
    expect(theme.status.attention.label).toBe("Attention");
    expect(theme.status.critical.label).toBe("Critical");
  });
});
