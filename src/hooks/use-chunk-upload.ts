"use client";

import axios from "axios";
import { useCallback, useRef, useState } from "react";
import {
  createChunkMetadata,
  createChunks,
  DEFAULT_CHUNK_SIZE,
} from "@/lib/chunk";

interface UploadOptions {
  directory: string;
  chunkSize?: number;
}

interface UploadStartResponse {
  success: boolean;
  uploadId: string;
  chunkSize: number;
  totalChunks: number;
  expiresAt: string;
}

interface UploadChunkResponse {
  success: boolean;
  duplicate: boolean;
  uploadedChunks: number;
  totalChunks: number;
  progress: number;
}

export interface UploadResult {
  success: boolean;
  path: string;
}

export function useChunkUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadIdRef = useRef<string | null>(null);

  const cancel = useCallback(async () => {
    abortControllerRef.current?.abort();

    const uploadId = uploadIdRef.current;

    if (!uploadId) {
      return;
    }

    try {
      await axios.delete(`/api/uploads/abort/${uploadId}`);
    } catch {
      // Ignore cleanup error
    }

    uploadIdRef.current = null;
  }, []);

  const upload = useCallback(
    async (file: File, options: UploadOptions): Promise<UploadResult> => {
      setUploading(true);
      setProgress(0);
      setUploadedBytes(0);
      setError(null);

      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
        const metadata = createChunkMetadata(file, chunkSize);
        const chunks = createChunks(file, chunkSize);

        // 1. Start upload
        const startResponse = await axios.post<UploadStartResponse>(
          "/api/uploads/start",
          {
            fileName: metadata.fileName,
            fileSize: metadata.fileSize,
            fileType: metadata.fileType,
            directory: options.directory,
            chunkSize: metadata.chunkSize,
            totalChunks: metadata.totalChunks,
          },
          {
            signal: controller.signal,
          },
        );

        const uploadId = startResponse.data.uploadId;

        uploadIdRef.current = uploadId;

        // 2. Upload chunks
        for (const chunk of chunks) {
          const formData = new FormData();

          formData.append("uploadId", uploadId);
          formData.append("chunkIndex", String(chunk.index));
          formData.append("totalChunks", String(chunks.length));
          formData.append("chunk", chunk.blob, file.name);

          const response = await axios.post<UploadChunkResponse>(
            "/api/uploads/chunk",
            formData,
            {
              signal: controller.signal,
            },
          );

          setProgress(response.data.progress);
          setUploadedBytes(Math.min((chunk.index + 1) * chunkSize, file.size));
        }

        // 3. Complete
        const completeResponse = await axios.post<UploadResult>(
          "/api/uploads/complete",
          {
            uploadId,
          },
          {
            signal: controller.signal,
          },
        );

        return completeResponse.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
          throw new Error("Upload dibatalkan.");
        }

        let message = "Gagal mengupload gambar.";

        if (axios.isAxiosError(error)) {
          if (!error.response) {
            message = "Tidak dapat terhubung ke server.";
          } else {
            switch (error.response.status) {
              case 400:
                message = "Data upload tidak valid.";
                break;

              case 401:
                message = "Anda harus login terlebih dahulu.";
                break;

              case 403:
                message = "Anda tidak memiliki izin untuk mengupload.";
                break;

              case 413:
                message = "Ukuran file terlalu besar.";
                break;

              case 422:
                message = "File yang diupload tidak valid.";
                break;

              case 500:
                message = "Server gagal memproses upload.";
                break;

              case 502:
              case 503:
              case 504:
                message = "Layanan upload sedang tidak tersedia.";
                break;
            }
          }
        }

        setError(message);

        throw new Error(message);
      } finally {
        setUploading(false);
        abortControllerRef.current = null;
        uploadIdRef.current = null;
      }
    },
    [],
  );

  return {
    upload,
    cancel,
    uploading,
    progress,
    uploadedBytes,
    error,
  };
}
