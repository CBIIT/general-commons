const { ManifestService } = require("../../services/mainfest-service");

// Mock the AWS SDK modules
jest.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: jest.fn().mockImplementation((params) => params),
}));

jest.mock("@aws-sdk/cloudfront-signer", () => ({
  getSignedUrl: jest.fn(),
}));

// Mock the config module
jest.mock("../../config", () => ({
  FILE_MANIFEST_BUCKET_NAME: "test-bucket",
  CLOUDFRONT_KEY_PAIR_ID: "test-key-pair-id",
  CLOUDFRONT_PRIVATE_KEY: "test-private-key",
  CLOUDFRONT_DOMAIN: "https://test.cloudfront.net",
  SIGNED_URL_EXPIRY_SECONDS: 600,
}));

// Mock the logger
jest.mock("../../logger", () => ({
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

describe("ManifestService", () => {
  let manifestService;
  let mockS3Client;

  beforeEach(() => {
    jest.clearAllMocks();
    mockS3Client = {
      send: jest.fn().mockResolvedValue({}),
    };
    manifestService = new ManifestService(mockS3Client);
  });

  describe("uploadManifestToS3", () => {
    const validManifestData = JSON.stringify([
      { file_name: "file1.txt", file_size: 100 },
      { file_name: "file2.txt", file_size: 200 },
    ]);

    it("should successfully upload manifest and return signed URL", async () => {
      const expectedSignedUrl = "https://signed-url.cloudfront.net/file.csv";
      getSignedUrl.mockReturnValue(expectedSignedUrl);

      const result = await manifestService.uploadManifestToS3({
        manifest: validManifestData,
      });

      expect(result).toBe(expectedSignedUrl);
      expect(mockS3Client.send).toHaveBeenCalledTimes(1);
      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: "test-bucket",
        })
      );
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          keyPairId: "test-key-pair-id",
          privateKey: "test-private-key",
        })
      );
    });

    it("should throw error for invalid JSON manifest", async () => {
      await expect(
        manifestService.uploadManifestToS3({ manifest: "invalid json" })
      ).rejects.toThrow("An error occurred while parsing the manifest data");
    });

    it("should throw error when manifest is not an array", async () => {
      await expect(
        manifestService.uploadManifestToS3({
          manifest: JSON.stringify({ not: "an array" }),
        })
      ).rejects.toThrow("An error occurred while parsing the manifest data");
    });

    it("should throw error when manifest is null", async () => {
      await expect(
        manifestService.uploadManifestToS3({ manifest: null })
      ).rejects.toThrow("An error occurred while parsing the manifest data");
    });

    it("should throw error when S3 upload fails", async () => {
      mockS3Client.send.mockRejectedValue(new Error("S3 upload failed"));

      await expect(
        manifestService.uploadManifestToS3({ manifest: validManifestData })
      ).rejects.toThrow(
        "An error occurred while uploading the manifest to the S3 bucket"
      );
    });

    it("should throw error when signed URL generation fails", async () => {
      getSignedUrl.mockImplementation(() => {
        throw new Error("Signing failed");
      });

      await expect(
        manifestService.uploadManifestToS3({ manifest: validManifestData })
      ).rejects.toThrow(
        "An error occurred while requesting the signed URL for the manifest"
      );
    });
  });
});

