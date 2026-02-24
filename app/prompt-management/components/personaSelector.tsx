"use client"

import { Plus } from "lucide-react";
import { Persona } from "../types/types";
import { ChangeEvent, FC, useState } from "react";
import { Badge } from "./badge";

interface PersonaSelectorProps {
  value: string[];
  onChange: (ids: string[]) => void;
  personas: Persona[];
  onCreateNew: () => void;
}

export const PersonaSelector: FC<PersonaSelectorProps> = ({
  value,
  onChange,
  personas,
  onCreateNew,
}) => {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const availablePersonas: Persona[] = personas.filter(
    (p) => !value.includes(p.id)
  );

  const searchResults: Persona[] = availablePersonas.filter(
    (p) =>
      p.title.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (id: string): void => {
    onChange([...value, id]);
    setInput("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md min-h-[42px] focus-within:ring-2 ring-blue-500 bg-white"
        onClick={() => setIsOpen(true)}
      >
        {value.map((id) => {
          const persona = personas.find(
            (p) => p.id === id
          );
          if (!persona) return null;

          return (
            <Badge
              key={id}
              color="orange"
              onRemove={() =>
                onChange(value.filter((v) => v !== id))
              }
            >
              {persona.title}
            </Badge>
          );
        })}

        <input
          type="text"
          className="flex-1 outline-none min-w-[120px]"
          placeholder="Search personas..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {searchResults.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              <div className="font-medium">
                {p.title}
              </div>
              <div className="text-xs text-gray-500">
                {p.country}
              </div>
            </button>
          ))}

          {searchResults.length === 0 && (
            <div className="p-2">
              <p className="text-sm text-gray-500 px-2 py-1">
                No matches found.
              </p>
              <button
                type="button"
                onClick={onCreateNew}
                className="w-full text-left px-2 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 flex items-center gap-2"
              >
                <Plus size={14} />
                Create New Persona
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};