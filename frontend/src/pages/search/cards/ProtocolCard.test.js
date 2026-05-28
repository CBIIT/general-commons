import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { BrowserRouter } from "react-router-dom";
import ProtocolCard from "./ProtocolCard";

const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const baseData = {
  protocol_pk_id: "PROTO-001",
  protocol_name: "Dummy Protocol Alpha",
  protocol_type: "Dummy Assay",
  doi: "10.1234/dummy-doi-001",
  doi_url: "https://example.org/protocols/dummy-protocol-alpha",
  subject_ids_filter: ["DUMMY_SUBJECT_001"],
};

describe("Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = renderWithRouter(
      <ProtocolCard data={baseData} index={0} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when doi_url is empty", async () => {
    const dataWithoutDoiUrl = {
      ...baseData,
      doi_url: "",
    };

    const { container } = renderWithRouter(
      <ProtocolCard data={dataWithoutDoiUrl} index={0} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Basic Functionality", () => {
  it("should render without crashing", () => {
    renderWithRouter(<ProtocolCard data={baseData} index={0} />);
  });

  it("should render card wrapper with index id", () => {
    const { container } = renderWithRouter(
      <ProtocolCard data={baseData} index={2} />,
    );

    expect(
      container.querySelector("#global_search_card_2"),
    ).toBeInTheDocument();
  });

  it("should render protocol header and card index", () => {
    renderWithRouter(<ProtocolCard data={baseData} index={1} />);

    expect(screen.getByText("PROTOCOL")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("Implementation Requirements", () => {
  it("should render protocol id as a link to the data page", () => {
    renderWithRouter(<ProtocolCard data={baseData} index={0} />);

    const protocolIdLink = screen
      .getByText(baseData.protocol_pk_id)
      .closest("a");
    expect(protocolIdLink).toBeInTheDocument();
    const href = protocolIdLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/data\//);

    const payload = href.replace("/data/", "");
    const decodedPayload = decodeURIComponent(payload);
    expect(decodedPayload).toBe(
      JSON.stringify({
        autocomplete: [
          { type: "subjectIds", title: baseData.subject_ids_filter[0] },
        ],
      }),
    );
  });

  it("should render protocol name and protocol type", () => {
    renderWithRouter(<ProtocolCard data={baseData} index={0} />);

    expect(screen.getByText("Protocol Name:")).toBeInTheDocument();
    expect(screen.getByText(baseData.protocol_name)).toBeInTheDocument();
    expect(screen.getByText("Protocol Type:")).toBeInTheDocument();
    expect(screen.getByText(baseData.protocol_type)).toBeInTheDocument();
  });

  it("should render DOI as an external link when doi_url is present", () => {
    renderWithRouter(<ProtocolCard data={baseData} index={0} />);

    const doiLink = screen.getByText(baseData.doi).closest("a");
    expect(screen.getByText("DOI:")).toBeInTheDocument();
    expect(doiLink).toBeInTheDocument();
    expect(doiLink).toHaveAttribute("href", baseData.doi_url);
    expect(doiLink).toHaveAttribute("target", "_blank");
  });

  it("should render DOI as plain text when doi_url is empty", () => {
    const dataWithoutDoiUrl = {
      ...baseData,
      doi_url: "",
    };

    renderWithRouter(<ProtocolCard data={dataWithoutDoiUrl} index={0} />);

    const doiText = screen.getByText(baseData.doi);
    expect(doiText).toBeInTheDocument();
    expect(doiText.closest("a")).toBeNull();
  });

  it("should not render property rows for empty values", () => {
    const dataWithMissingType = {
      ...baseData,
      protocol_type: "",
    };

    renderWithRouter(<ProtocolCard data={dataWithMissingType} index={0} />);

    expect(screen.queryByText("Protocol Type:")).not.toBeInTheDocument();
    expect(screen.getByText("Protocol Name:")).toBeInTheDocument();
    expect(screen.getByText("DOI:")).toBeInTheDocument();
  });
});

