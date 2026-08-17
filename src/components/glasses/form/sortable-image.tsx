import Image from "next/image";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Loader2 } from "lucide-react";

interface Props {
  id: string;
  preview: string;
  order: number;
  deleting: boolean;
  onRemove: () => void;
}

export default function SortableImage({
  id,
  preview,
  order,
  deleting,
  onRemove,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        group relative
        cursor-grab overflow-hidden
        rounded-xl border
        bg-background
        active:cursor-grabbing
      "
    >
      <div className="relative aspect-square w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <Image
          src={preview}
          alt={`Foto ${order}`}
          fill
          unoptimized
          sizes="
            (max-width: 768px) 50vw,
            (max-width: 1024px) 33vw,
            25vw
          "
          width={0}
          height={0}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      <div
        className="
          absolute bottom-2 left-2
          rounded-md bg-black/70
          px-2 py-1
          text-xs font-medium text-white
          backdrop-blur-sm
        "
      >
        #{order}
      </div>

      <button
        type="button"
        aria-label={`Hapus foto ${order}`}
        disabled={deleting}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="
          absolute right-2 top-2
          cursor-pointer
          rounded-full
          bg-black/70 p-2
          text-white
          opacity-0
          transition-all
          duration-200
          hover:bg-red-500
          group-hover:opacity-100
          disabled:cursor-not-allowed
          disabled:opacity-100
        "
      >
        {deleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </button>

      <div
        className="
          pointer-events-none
          absolute inset-0
          transition-colors
          group-hover:border-primary/50
        "
      />
    </div>
  );
}