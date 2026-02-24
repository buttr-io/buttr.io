"use client"

import { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { Badge } from "./badge";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
}

export const TagInput: FC<TagInputProps> = ({
  value,
  onChange,
  availableTags,
}) => {
  const [input, setInput] = useState<string>("");

  const handleAdd = (tag: string): void => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const searchResults: string[] = availableTags.filter((t) =>
    t.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[42px] focus-within:ring-2 ring-blue-500 bg-white">
        {value.map((tag) => (
          <Badge
            key={tag}
            color="blue"
            onRemove={() =>
              onChange(value.filter((t) => t !== tag))
            }
          >
            {tag}
          </Badge>
        ))}

        <input
          type="text"
          className="flex-1 outline-none min-w-[120px]"
          placeholder="Search or create tags..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              handleAdd(input.trim());
            }
          }}
        />
      </div>

      {input && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
          {searchResults.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleAdd(tag)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Select "{tag}"
            </button>
          ))}

          {searchResults.length === 0 && (
            <button
              type="button"
              onClick={() => handleAdd(input)}
              className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 text-sm font-medium"
            >
              Create "{input}" as a new tag
            </button>
          )}
        </div>
      )}
    </div>
  );
};