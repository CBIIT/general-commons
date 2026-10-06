import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FileCard from "./FileCard";

const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const baseData = {
  file_id: "dg.4DFC/example-file",
  file_name: "example.bam",
  file_type: "BAM",
  subject_id: "SUBJECT-1",
  sample_id: "SAMPLE-1",
  subject_ids_filter: ["SUBJECT-1"],
};

describe("File card navigation", () => {
  it("links the file id to the Files tab so fileOverview runs for that file", () => {
    renderWithRouter(<FileCard data={baseData} index={0} />);

    const fileIdLink = screen.getByRole("link", { name: baseData.file_id });
    expect(fileIdLink).toBeInTheDocument();
    const href = fileIdLink.getAttribute("href");
    expect(href).toMatch(/^\/data\//);
    expect(href).toContain("selectedTab=files");

    const pathOnly = href.split("?")[0];
    const payload = pathOnly.replace("/data/", "");
    expect(decodeURIComponent(payload)).toBe(
      JSON.stringify({
        file_ids: [baseData.file_id],
      }),
    );
  });
});
