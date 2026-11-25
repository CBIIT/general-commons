import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import SampleCard from "./SampleCard";

const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const baseData = {
  sample_id: "SAMPLE-1",
  is_tumor: "Tumor",
  analyte_type: "DNA",
  subject_ids_filter: ["SUBJECT-1"],
};

describe("Sample card navigation", () => {
  it("links the sample id to the Samples tab so sampleOverview runs for that sample", () => {
    renderWithRouter(<SampleCard data={baseData} index={0} />);

    const sampleIdLink = screen.getByRole("link", { name: baseData.sample_id });
    expect(sampleIdLink).toBeInTheDocument();
    const href = sampleIdLink.getAttribute("href");
    expect(href).toMatch(/^\/data\//);
    expect(href).toContain("selectedTab=samples");

    const pathOnly = href.split("?")[0];
    const payload = pathOnly.replace("/data/", "");
    expect(decodeURIComponent(payload)).toBe(
      JSON.stringify({
        sample_ids: [baseData.sample_id],
      }),
    );
  });
});
