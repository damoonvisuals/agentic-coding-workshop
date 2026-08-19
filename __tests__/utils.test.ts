import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("ignores falsy values", () => {
    expect(cn("btn", false && "hidden", undefined, null)).toBe("btn");
  });

  it("applies conditional classes from object syntax", () => {
    expect(cn("btn", { active: true, disabled: false })).toBe("btn active");
  });

  it("resolves conflicting Tailwind classes, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
