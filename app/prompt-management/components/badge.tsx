import { X } from "lucide-react";
import { BadgeProps } from "../types/types";
import { FC } from "react";

export const Badge: FC<BadgeProps> = ({
  children,
  color = "blue",
  onRemove,
}) => {
  const colors: Record<
    NonNullable<BadgeProps["color"]>,
    string
  > = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    green: "bg-green-100 text-green-800 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[color]} mr-1 mb-1`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-gray-900 focus:outline-none"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};