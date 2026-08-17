import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIRECTORY = path.join(
  process.cwd(),
  ".uploads",
);

export interface UploadMetadata {
  uploadId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  directory: string;
  chunkSize: number;
  totalChunks: number;
  createdAt: number;
}

async function ensureUploadDirectory(
  uploadId: string,
) {
  const directory = path.join(
    UPLOAD_DIRECTORY,
    uploadId,
  );

  await fs.mkdir(directory, {
    recursive: true,
  });

  return directory;
}

export async function saveMetadata(
  metadata: UploadMetadata,
) {
  const directory = await ensureUploadDirectory(
    metadata.uploadId,
  );

  await fs.writeFile(
    path.join(directory, "metadata.json"),
    JSON.stringify(metadata),
    "utf8",
  );
}

export async function getMetadata(
  uploadId: string,
): Promise<UploadMetadata> {
  const directory = path.join(
    UPLOAD_DIRECTORY,
    uploadId,
  );

  const content = await fs.readFile(
    path.join(directory, "metadata.json"),
    "utf8",
  );

  return JSON.parse(content) as UploadMetadata;
}

export async function saveChunk(
  uploadId: string,
  index: number,
  buffer: Buffer,
) {
  const directory =
    await ensureUploadDirectory(uploadId);

  await fs.writeFile(
    path.join(directory, `${index}.chunk`),
    buffer,
  );
}

export async function getChunk(
  uploadId: string,
  index: number,
) {
  const directory = path.join(
    UPLOAD_DIRECTORY,
    uploadId,
  );

  return fs.readFile(
    path.join(directory, `${index}.chunk`),
  );
}

export async function hasChunk(
  uploadId: string,
  index: number,
) {
  const directory = path.join(
    UPLOAD_DIRECTORY,
    uploadId,
  );

  try {
    await fs.access(
      path.join(directory, `${index}.chunk`),
    );

    return true;
  } catch {
    return false;
  }
}

export async function deleteUpload(
  uploadId: string,
) {
  await fs.rm(
    path.join(UPLOAD_DIRECTORY, uploadId),
    {
      recursive: true,
      force: true,
    },
  );
}