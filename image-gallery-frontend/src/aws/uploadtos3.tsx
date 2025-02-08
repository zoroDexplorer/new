import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { REACT_APP_AWS_ACCESS_KEY_ID, REACT_APP_AWS_SECRET_ACCESS_KEY } from "../config/environment.tsx";

const REGION = "ap-south-1";
const BUCKET_NAME = "memoriesbucketgallery";

// Configure S3 client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY || "",
  },
});

const uploadToS3 = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  console.log("Uploading file:", file);

  const key = `images/${Date.now()}_${file.name}`;

  // Convert File to Uint8Array (Fix for AWS SDK issue)
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  // Note: ACL property removed as bucket disables ACLs
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer, 
    ContentType: file.type,
  };

  console.log("Uploading with params:", params);

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log("Upload response:", response);

    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    console.log("File uploaded successfully:", url);

    return url;
  } catch (error: any) {
    console.error("Error uploading file:", error.message || error);
    throw new Error("Failed to upload file to S3. Please try again.");
  }
};

export default uploadToS3;
