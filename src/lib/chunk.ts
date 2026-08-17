export const DEFAULT_CHUNK_SIZE = 500 * 1024;

export interface FileChunk {
  index: number;
  start: number;
  end: number;
  size: number;
  blob: Blob;
}

export interface ChunkMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  chunkSize: number;
  totalChunks: number;
}

export function createChunks(
  file: File,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): FileChunk[] {
  const chunks: FileChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);

    chunks.push({
      index,
      start,
      end,
      size: end - start,
      blob: file.slice(start, end),
    });

    start = end;
    index++;
  }

  return chunks;
}

export function calculateChunkCount(
  fileSize: number,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): number {
  return Math.ceil(fileSize / chunkSize);
}

export function calculateProgress(
  uploadedBytes: number,
  totalBytes: number,
): number {
  if (totalBytes <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((uploadedBytes / totalBytes) * 100),
  );
}

export function createChunkMetadata(
  file: File,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): ChunkMetadata {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    chunkSize,
    totalChunks: calculateChunkCount(
      file.size,
      chunkSize,
    ),
  };
}

export function createUploadId(): string {
  return crypto.randomUUID();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat(
    (bytes / Math.pow(k, i)).toFixed(2),
  )} ${sizes[i]}`;
}