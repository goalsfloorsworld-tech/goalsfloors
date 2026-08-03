import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://s3.ca-east-006.backblazeb2.com",
  region: "ca-east-006",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID as string,
    secretAccessKey: process.env.B2_APP_KEY as string,
  },
});

async function setCors() {
  const command = new PutBucketCorsCommand({
    Bucket: "goals-floors-pdf",
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "HEAD", "DELETE"],
          AllowedOrigins: ["*"], // Allows from localhost and any vercel domain
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  });

  try {
    const data = await s3Client.send(command);
    console.log("Success! CORS is now set on the bucket.", data);
  } catch (error) {
    console.error("Error setting CORS:", error);
  }
}

setCors();
