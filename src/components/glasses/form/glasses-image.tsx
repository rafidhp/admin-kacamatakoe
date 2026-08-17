"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChunkUpload } from "@/hooks/use-chunk-upload";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "./sortable-image";
import type { FormType } from "../types";

interface GlassesImageProps {
  data: FormType;
  setData: Dispatch<SetStateAction<FormType>>;
  onLoadingChange: (loading: boolean) => void;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function GlassesImage({
  data,
  setData,
  onLoadingChange,
}: GlassesImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    upload,
    cancel,
    uploading,
    progress,
    error,
  } = useChunkUpload();

  useEffect(() => {
    onLoadingChange(uploading || deleting);
  }, [
    uploading,
    deleting,
    onLoadingChange,
  ]);

  async function handleFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const selectedFiles =
      Array.from(files);

    const remainingSlots =
      MAX_IMAGES - data.images.length;

    if (remainingSlots <= 0) {
      return;
    }

    const filesToUpload =
      selectedFiles.slice(
        0,
        remainingSlots,
      );

    for (const file of filesToUpload) {
      if (
        file.size > MAX_FILE_SIZE
      ) {
        console.error(
          `${file.name} terlalu besar.`,
        );

        continue;
      }

      try {
        const result = await upload(file, {
          directory: "glasses",
        });

        setData((current) => ({
          ...current,

          images: [
            ...current.images,
            {
              id: crypto.randomUUID(),
              image: result.path,
              sortOrder: current.images.length + 1,
            },
          ],
        }));
      } catch (error) {
        console.error(
          "Upload failed:",
          error,
        );
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const removeImage = async (index: number) => {
    const image = data.images[index];

    if (!image) {
      return;
    }
    setDeleting(true);
    setDeletingId(image.id);

    try {
      const response = await fetch(
        "/api/uploads/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: image.image,
          }),
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Gagal menghapus gambar.",
        );
      }

      setData((current) => ({
        ...current,
        images: current.images
          .filter(
            (_, imageIndex) =>
              imageIndex !== index,
          )
          .map((image, index) => ({
            ...image,
            sortOrder: index + 1,
          })),
      }));
    } catch (error) {
      console.error(
        "Failed to delete image:",
        error,
      );
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setData((current) => {
      const oldIndex = current.images.findIndex(
        (image) => image.id === active.id,
      );

      const newIndex = current.images.findIndex(
        (image) => image.id === over.id,
      );

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      const images = arrayMove(
        current.images,
        oldIndex,
        newIndex,
      ).map((image, index) => ({
        ...image,
        sortOrder: index + 1,
      }));

      return {
        ...current,
        images,
      };
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-4 text-2xl font-medium">Foto Kacamata</h2>
      <div className="flex flex-col gap-2">
        <Label>Foto Foto Kacamata</Label>
        <label
          htmlFor="glasses-images"
          className="border-muted-foreground/30 bg-muted/30 hover:border-primary hover:bg-muted/50 flex h-56 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all"
        >
          {uploading ? (
            <>
              <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />

              <div className="text-center">
                <p className="font-medium">
                  Mengupload gambar...
                </p>

                <p className="text-muted-foreground text-sm">
                  {progress}%
                </p>
              </div>
            </>
          ) : (
            <>
              <ImagePlus className="text-muted-foreground h-12 w-12" />

              <div className="text-center">
                <p className="font-medium">
                  Click to upload or drag & drop
                </p>

                <p className="text-muted-foreground text-sm">
                  PNG, JPG, WEBP (Max 10 MB each)
                </p>

                <p className="text-muted-foreground mt-1 text-xs">
                  Maximum 10 images
                </p>
              </div>
            </>
          )}

          <Input
            ref={inputRef}
            id="glasses-images"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(event) =>
              handleFiles(
                event.target.files,
              )
            }
          />
        </label>
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {uploading && (
          <Button
            type="button"
            variant="destructive"
            onClick={cancel}
          >
            Batalkan upload
          </Button>
        )}
      </div>
      {data.images.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            <Label>Gallery Preview</Label>

            <p className="text-xs text-muted-foreground">
              Drag & drop images to change their display order.
            </p>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.images.map((image) => image.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className="
                  mt-3 grid grid-cols-2 gap-4
                  md:grid-cols-3
                  lg:grid-cols-4
                "
              >
                {data.images.map((image) => (
                  <SortableImage
                    key={image.id}
                    id={image.id}
                    preview={image.image}
                    order={image.sortOrder}
                    deleting={deletingId === image.id}
                    onRemove={() => {
                      const index = data.images.findIndex(
                        (item) => item.id === image.id,
                      );

                      if (index !== -1) {
                        void removeImage(index);
                      }
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
