import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import DataModelNavigator from "./index";

jest.mock("../../utils/env", () => ({
  __esModule: true,
  default: { REACT_APP_DMN_URL: "https://example.com/dmn" },
}));

describe("Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<DataModelNavigator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Basic Functionality", () => {
  it("should render without crashing", () => {
    render(<DataModelNavigator />);
  });

  it("should render an iframe with the DMN URL", () => {
    render(<DataModelNavigator />);
    const iframe = screen.getByTitle("Data Model Navigator");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com/dmn");
  });

  it("should have the correct sandbox attributes", () => {
    render(<DataModelNavigator />);
    const sandbox = screen
      .getByTitle("Data Model Navigator")
      .getAttribute("sandbox")
      .split(" ");
    expect(sandbox).toContain("allow-popups");
    expect(sandbox).toContain("allow-scripts");
    expect(sandbox).toContain("allow-same-origin");
    expect(sandbox).toContain("allow-downloads");
  });
});

