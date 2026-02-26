import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import TextBanner from "./TextBannerView";

describe("Accessibility", () => {
  it("should have no accessibility violations with heading", async () => {
    const { container } = render(
      <TextBanner heading="Test Heading" aria-label="Announcement banner" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with heading and text", async () => {
    const { container } = render(
      <TextBanner
        heading="Test Heading"
        text="Test content"
        aria-label="Announcement banner"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with link in heading", async () => {
    const { container } = render(
      <TextBanner
        heading={
          <>
            Download the{" "}
            <a href="https://example.com/file.pdf" download>
              User Guide
            </a>
          </>
        }
        aria-label="Announcement banner"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should pass through aria-label prop", () => {
    render(<TextBanner heading="Test" aria-label="Announcement banner" />);
    expect(screen.getByLabelText("Announcement banner")).toBeInTheDocument();
  });

  it("should render as a section element", () => {
    const { container } = render(<TextBanner heading="Test" />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});

describe("Basic Functionality", () => {
  it("should render without crashing", () => {
    render(<TextBanner />);
  });

  it("should render heading text when provided", () => {
    render(<TextBanner heading="Test Heading" />);
    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Test Heading",
    );
  });

  it("should render text content when provided", () => {
    render(<TextBanner text="Test paragraph content" />);
    expect(screen.getByText("Test paragraph content")).toBeInTheDocument();
  });

  it("should render both heading and text when provided", () => {
    render(<TextBanner heading="My Heading" text="My text content" />);
    expect(screen.getByText("My Heading")).toBeInTheDocument();
    expect(screen.getByText("My text content")).toBeInTheDocument();
  });

  it("should not render heading element when heading is not provided", () => {
    render(<TextBanner text="Only text" />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("should render JSX content in heading", () => {
    render(
      <TextBanner
        heading={
          <>
            Click <a href="https://example.com">here</a> for more info
          </>
        }
      />,
    );
    expect(screen.getByText("here")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("should render link with download attribute in heading", () => {
    render(
      <TextBanner
        heading={
          <>
            Download the{" "}
            <a href="https://example.com/file.pdf" download>
              User Guide
            </a>
          </>
        }
      />,
    );
    const link = screen.getByText("User Guide");
    expect(link).toHaveAttribute("href", "https://example.com/file.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("should pass additional props to the section element", () => {
    render(<TextBanner heading="Test" data-testid="custom-banner" />);
    expect(screen.getByTestId("custom-banner")).toBeInTheDocument();
  });
});

