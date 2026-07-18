import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: "https://s3.ca-east-006.backblazeb2.com",
  region: "ca-east-006",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID as string,
    secretAccessKey: process.env.B2_APP_KEY as string,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  const action = searchParams.get("action");

  if (!file) {
    return NextResponse.json(
      { error: "Missing 'file' parameter" },
      { status: 400 }
    );
  }

  try {
    const bucketParams: any = {
      Bucket: "goals-floors-pdf",
      Key: file,
    };

    if (action === "download") {
      bucketParams.ResponseContentDisposition = "attachment";
    }

    const command = new GetObjectCommand(bucketParams);
    
    // Generate a presigned URL valid for 3600 seconds (1 hour)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
