import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import ResponsiveImage from "../ResponsiveImage";

describe("ResponsiveImage", () => {
  it("can preserve an approved compact original without requesting nonexistent variants", () => {
    const { container } = render(
      <ResponsiveImage
        src="/images/approved-artwork.jpg"
        alt="Approved artwork"
        responsive={false}
      />
    );

    expect(container.querySelectorAll("source")).toHaveLength(0);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/images/approved-artwork.jpg"
    );
  });
});
