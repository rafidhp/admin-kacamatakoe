import { toast } from "sonner";

const baseStyle = {
  background: '#fff',
  color: '#000',
};

export const showSuccessToast = (
  title: string,
  description?: string,
) => {
  toast.success(title, {
    description,
    style: {
      ...baseStyle,
      border: '1px solid #000',
    },
  });
};

export const showErrorToast = (
  title: string,
  description?: string,
) => {
  toast.error(title, {
    description,
    style: {
      ...baseStyle,
      border: '1px solid rgba(255,0,0,0.7)',
    },
  });
};

export const showInfoToast = (
  title: string,
  description?: string,
) => {
  toast(title, {
    description,
    style: {
      ...baseStyle,
      border: '1px solid rgba(255,255,255,0.15)',
    },
  });
};