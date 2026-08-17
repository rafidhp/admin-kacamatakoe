import { NextResponse } from "next/server";
import { deleteUpload } from "@/lib/upload-storage";

interface RouteContext {
  params: Promise<{
    uploadId: string;
  }>;
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { uploadId } =
      await context.params;

    await deleteUpload(uploadId);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membatalkan upload.",
      },
      { status: 500 },
    );
  }
}