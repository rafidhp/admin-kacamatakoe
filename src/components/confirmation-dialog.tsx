import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string | null;
  isSubmitting: boolean;
  text: string;
  submittingText?: string;
  loadingSubmittingText?: string;
  handleSubmit: () => void;
}

export default function ConfirmationDialog({
  open,
  onClose,
  title,
  description,
  text,
  isSubmitting = false,
  submittingText = 'Hapus',
  loadingSubmittingText = 'Menghapus',
  handleSubmit,
}: ConfirmationDialogProps) {
  if (!open) {
    return;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="group hover:bg-red-500/5 transition cursor-pointer"
          >
            <X className="size-5 group-hover:text-red-500 transition" />
          </Button>
        </div>
        <div className="w-full text-gray-700">
          {text}
        </div>
        <div className="ms-auto flex justify-end gap-2 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer bg-red-500 text-white hover:bg-red-900 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {loadingSubmittingText}...
              </>
            ) : submittingText}
          </Button>
        </div>
      </div>
    </div>
  )
}