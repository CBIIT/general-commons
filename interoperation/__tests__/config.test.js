describe("config", () => {
  const originalEnv = process.env;
  const originalExit = process.exit;
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Mock process.exit to prevent test from exiting
    process.exit = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    process.exit = originalExit;
    console.error = originalConsoleError;
  });

  const setRequiredEnvVars = () => {
    process.env.AWS_REGION = "us-east-1";
    process.env.FILE_MANIFEST_BUCKET_NAME = "test-bucket";
    process.env.CLOUDFRONT_KEY_PAIR_ID = "test-key-pair-id";
    process.env.CLOUDFRONT_PRIVATE_KEY = "test-private-key";
    process.env.CLOUDFRONT_DOMAIN = "https://test.cloudfront.net";
  };

  describe("validatePort", () => {
    it("should use default port 4030 when PORT is not set", () => {
      setRequiredEnvVars();
      delete process.env.PORT;

      const config = require("../config");

      expect(config.PORT).toBe("4030");
    });

    it("should use provided PORT when valid", () => {
      setRequiredEnvVars();
      process.env.PORT = "8080";

      const config = require("../config");

      expect(config.PORT).toBe("8080");
    });

    it("should use default port when PORT is NaN", () => {
      setRequiredEnvVars();
      process.env.PORT = "invalid";

      const config = require("../config");

      expect(config.PORT).toBe("4030");
    });

    it("should use default port when PORT is negative", () => {
      setRequiredEnvVars();
      process.env.PORT = "-1";

      const config = require("../config");

      expect(config.PORT).toBe("4030");
    });
  });

  describe("DEV_MODE", () => {
    it("should be true when NODE_ENV is development", () => {
      setRequiredEnvVars();
      process.env.NODE_ENV = "development";
      process.env.S3_ACCESS_KEY_ID = "test-key";
      process.env.S3_SECRET_ACCESS_KEY = "test-secret";

      const config = require("../config");

      expect(config.DEV_MODE).toBe(true);
    });

    it("should be false when NODE_ENV is not development", () => {
      setRequiredEnvVars();
      process.env.NODE_ENV = "production";

      const config = require("../config");

      expect(config.DEV_MODE).toBe(false);
    });
  });

  describe("checkRequiredVariablesAreSet", () => {
    it("should call process.exit when required variables are missing", () => {
      // Don't set any required env vars
      delete process.env.AWS_REGION;
      delete process.env.FILE_MANIFEST_BUCKET_NAME;

      require("../config");

      expect(process.exit).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("required environment variables are not set")
      );
    });

    it("should not call process.exit when all required variables are set", () => {
      setRequiredEnvVars();

      require("../config");

      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe("default values", () => {
    it("should use default VERSION when not set", () => {
      setRequiredEnvVars();
      delete process.env.VERSION;

      const config = require("../config");

      expect(config.VERSION).toBe("x.x.x");
    });

    it("should use default DATE when not set", () => {
      setRequiredEnvVars();
      delete process.env.DATE;

      const config = require("../config");

      expect(config.DATE).toBe("xxxx-xx-xx");
    });

    it("should use default LOG_LEVEL when not set", () => {
      setRequiredEnvVars();
      delete process.env.LOG_LEVEL;

      const config = require("../config");

      expect(config.LOG_LEVEL).toBe("info");
    });

    it("should use default SIGNED_URL_EXPIRY_SECONDS when not set", () => {
      setRequiredEnvVars();
      delete process.env.SIGNED_URL_EXPIRY_SECONDS;

      const config = require("../config");

      expect(config.SIGNED_URL_EXPIRY_SECONDS).toBe(600);
    });
  });
});

