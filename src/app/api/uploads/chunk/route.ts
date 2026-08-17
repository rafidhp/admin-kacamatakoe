import { NextResponse } from "next/server";
import {
  getMetadata,
  hasChunk,
  saveChunk,
} from "@/lib/upload-storage";

export async function POST(
  request: Request,
) {
  try {
    const formData = await request.formData();

    const uploadId =
      formData.get("uploadId");

    const chunkIndex =
      formData.get("chunkIndex");

    const chunk =
      formData.get("chunk");

    if (
      typeof uploadId !== "string" ||
      typeof chunkIndex !== "string" ||
      !(chunk instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data chunk tidak valid.",
        },
        { status: 422 },
      );
    }

    const metadata =
      await getMetadata(uploadId);

    const index = Number(chunkIndex);

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= metadata.totalChunks
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Index chunk tidak valid.",
        },
        { status: 422 },
      );
    }

    const exists = await hasChunk(
      uploadId,
      index,
    );

    if (!exists) {
      const buffer = Buffer.from(
        await chunk.arrayBuffer(),
      );

      await saveChunk(
        uploadId,
        index,
        buffer,
      );
    }

    let uploadedChunks = 0;

    for (
      let i = 0;
      i < metadata.totalChunks;
      i++
    ) {
      if (
        await hasChunk(uploadId, i)
      ) {
        uploadedChunks++;
      }
    }

    const progress = Math.round(
      (uploadedChunks /
        metadata.totalChunks) *
        100,
    );

    return NextResponse.json({
      success: true,
      duplicate: exists,
      uploadedChunks,
      totalChunks: metadata.totalChunks,
      progress,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload chunk.",
      },
      { status: 500 },
    );
  }
}