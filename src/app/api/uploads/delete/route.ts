import { NextResponse } from "next/server";
import { deleteFromGithub } from "@/lib/github-storage";

interface DeleteImageRequest {
  image: string;
}

export async function DELETE(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as DeleteImageRequest;

    if (!body.image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image URL wajib diisi.",
        },
        { status: 400 },
      );
    }

    await deleteFromGithub(body.image);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete image:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus gambar.",
      },
      { status: 500 },
    );
  }
}