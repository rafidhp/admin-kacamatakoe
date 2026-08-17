import { NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  saveMetadata,
  type UploadMetadata,
} from "@/lib/upload-storage";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const {
      fileName,
      fileSize,
      fileType,
      directory,
      chunkSize,
      totalChunks,
    } = body;

    if (
      typeof fileName !== "string" ||
      typeof fileSize !== "number" ||
      typeof fileType !== "string" ||
      typeof directory !== "string" ||
      typeof chunkSize !== "number" ||
      typeof totalChunks !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data upload tidak valid.",
        },
        { status: 422 },
      );
    }

    const uploadId = crypto.randomUUID();

    const metadata: UploadMetadata = {
      uploadId,
      fileName,
      fileSize,
      fileType,
      directory,
      chunkSize,
      totalChunks,
      createdAt: Date.now(),
    };

    await saveMetadata(metadata);

    return NextResponse.json({
      success: true,
      uploadId,
      chunkSize,
      totalChunks,
      expiresAt: new Date(
        Date.now() + 60 * 60 * 1000,
      ).toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memulai upload.",
      },
      { status: 500 },
    );
  }
}