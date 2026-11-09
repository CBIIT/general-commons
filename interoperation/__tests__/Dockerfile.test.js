const fs = require("fs");
const path = require("path");

const dockerfile = fs.readFileSync(path.join(__dirname, "../Dockerfile"), "utf8");

describe("CDS-1795 container remediation", () => {
  it("uses the apt-patched Node 26 Trixie image in both stages", () => {
    const baseImages = dockerfile.match(/^FROM .+$/gm);

    expect(baseImages).toEqual([
      "FROM node:26.13.0-trixie-slim AS build",
      "FROM node:26.13.0-trixie-slim AS fnl_base_image",
    ]);
  });

  it("pins the zlib security update without broadly upgrading OS packages", () => {
    expect(dockerfile).toMatch(
      /apt-get install -y --only-upgrade --no-install-recommends\s*\\\s*zlib1g=1:1\.3\.dfsg\+really1\.3\.1-1\+deb13u1/
    );
    expect(dockerfile).not.toMatch(/apt(?:-get)?\s+(?:dist-|full-)?upgrade/);
    expect(dockerfile).toContain("rm -rf /var/lib/apt/lists/*");
  });
});
