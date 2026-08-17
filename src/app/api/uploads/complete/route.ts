import { NextResponse } from "next/server";
import {
  getMetadata,
  getChunk,
  hasChunk,
  deleteUpload,
} from "@/lib/upload-storage";
import { uploadToGithub } from "@/lib/github-storage";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const uploadId = body.uploadId;

    if (typeof uploadId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Upload ID tidak valid.",
        },
        { status: 422 },
      );
    }

    const metadata =
      await getMetadata(uploadId);

    for (
      let i = 0;
      i < metadata.totalChunks;
      i++
    ) {
      const exists =
        await hasChunk(uploadId, i);

      if (!exists) {
        return NextResponse.json(
          {
            success: false,
            message: `Chunk ${i} belum tersedia.`,
          },
          { status: 400 },
        );
      }
    }

    const buffers: Buffer[] = [];

    for (
      let i = 0;
      i < metadata.totalChunks;
      i++
    ) {
      const buffer =
        await getChunk(uploadId, i);

      buffers.push(buffer);
    }

    const fileBuffer = Buffer.concat(buffers);

    if (
      fileBuffer.length !==
      metadata.fileSize
    ) {
      await deleteUpload(uploadId);

      return NextResponse.json(
        {
          success: false,
          message:
            "Ukuran file hasil upload tidak sesuai.",
        },
        { status: 400 },
      );
    }

    const url =
      await uploadToGithub(
        fileBuffer,
        metadata.directory,
        metadata.fileName,
      );

    await deleteUpload(uploadId);

    return NextResponse.json({
      success: true,
      path: url,
    });
  } catch (error) {
    console.error(
      "Complete upload error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyelesaikan upload.",
      },
      { status: 500 },
    );
  }
}