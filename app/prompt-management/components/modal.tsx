
"use client"

import { X } from "lucide-react";
import { FC, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> =
    {
      md: "max-w-2xl",
      lg: "max-w-4xl",
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
