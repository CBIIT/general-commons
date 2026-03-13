// Mock the AWS SDK before requiring the service
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation((config) => ({
    config,
  })),
}));

// Mock the config module
jest.mock("../../config", () => ({
  AWS_REGION: "us-east-1",
  S3_ACCESS_KEY_ID: null,
  S3_SECRET_ACCESS_KEY: null,
}));

const { S3Client } = require("@aws-sdk/client-s3");

describe("S3Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the module cache to allow fresh imports with different config
    jest.resetModules();
  });

  it("should create S3Client with region configuration", () => {
    // Re-mock config for this test
    jest.doMock("../../config", () => ({
      AWS_REGION: "us-west-2",
      S3_ACCESS_KEY_ID: null,
      S3_SECRET_ACCESS_KEY: null,
    }));

    // Re-mock S3Client to capture the config
    const mockS3Client = jest.fn().mockImplementation((config) => ({ config }));
    jest.doMock("@aws-sdk/client-s3", () => ({
      S3Client: mockS3Client,
    }));

    const { S3Service } = require("../../services/s3-service");
    const service = new S3Service();

    expect(mockS3Client).toHaveBeenCalledWith(
      expect.objectContaining({
        region: "us-west-2",
      })
    );
    expect(service.s3Client).toBeDefined();
  });

  it("should create S3Service instance with s3Client property", () => {
    const { S3Service } = require("../../services/s3-service");
    const service = new S3Service();

    expect(service.s3Client).toBeDefined();
  });
});

