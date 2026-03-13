const express = require("express");
const request = require("supertest");

// Mock the config module
jest.mock("../../config", () => ({
  VERSION: "1.2.3",
  DATE: "2025-01-15",
  DEV_MODE: false,
}));

const healthCheckRouter = require("../../routes/healthCheckRouter");

describe("healthCheckRouter", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use("/api/interoperation", healthCheckRouter);
  });

  describe("GET /ping", () => {
    it("should return 'pong'", async () => {
      const response = await request(app).get("/api/interoperation/ping");

      expect(response.status).toBe(200);
      expect(response.text).toBe("pong");
    });
  });

  describe("GET /version", () => {
    it("should return version and date", async () => {
      const response = await request(app).get("/api/interoperation/version");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        version: "1.2.3",
        date: "2025-01-15",
      });
    });
  });
});

describe("healthCheckRouter in DEV_MODE", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should expose /test-error endpoint in dev mode", async () => {
    // Re-mock config with DEV_MODE enabled
    jest.doMock("../../config", () => ({
      VERSION: "1.2.3",
      DATE: "2025-01-15",
      DEV_MODE: true,
    }));

    const devHealthCheckRouter = require("../../routes/healthCheckRouter");
    const app = express();
    app.use("/api/interoperation", devHealthCheckRouter);
    app.use((err, req, res, next) => {
      res.status(500).send(err.message);
    });

    const response = await request(app).get("/api/interoperation/test-error");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Test error");
  });
});

