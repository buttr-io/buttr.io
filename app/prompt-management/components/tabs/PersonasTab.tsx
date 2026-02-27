import React from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Persona } from "../../types/types";

interface PersonasTabProps {
  personaSearchQuery: string;
  setPersonaSearchQuery: React.Dispatch<
    React.SetStateAction<string>
  >;

  filteredPersonas: Persona[];
  getLinkedPromptCount: (
    id: string
  ) => number;

  handleOpenPersonaModal: (
    persona?: Persona | null
  ) => void;

  handleDeletePersona: (
    id: string
  ) => void;

  setPersonaFilter: React.Dispatch<
    React.SetStateAction<string>
  >;

  setActiveTab: React.Dispatch<
    React.SetStateAction<
      "prompts" | "personas" | "history"
    >
  >;
}

function PersonasTab({
  personaSearchQuery,
  setPersonaSearchQuery,
  filteredPersonas,
  getLinkedPromptCount,
  handleOpenPersonaModal,
  handleDeletePersona,
  setPersonaFilter,
  setActiveTab,
}: PersonasTabProps) {
  return (
      <div className="space-y-6">
            
            {/* Header */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-lg w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search personas by title or country..."
                  value={personaSearchQuery}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setPersonaSearchQuery(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  handleOpenPersonaModal()
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <Plus size={18} />
                Create Persona
              </button>
            </div>

            {/* Table */}

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="p-4 font-medium">
                      Title
                    </th>
                    <th className="p-4 font-medium">
                      Country
                    </th>
                    <th className="p-4 font-medium">
                      Linked Prompts
                    </th>
                    <th className="p-4 font-medium">
                      Created
                    </th>
                    <th className="p-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPersonas.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-gray-500"
                      >
                        No personas found.
                      </td>
                    </tr>
                  ) : (
                    filteredPersonas.map(
                      (persona) => {
                        const linkCount =
                          getLinkedPromptCount(
                            persona.id
                          );

                        return (
                          <tr
                            key={persona.id}
                            className="hover:bg-gray-50 group"
                          >
                            <td className="p-4 font-medium text-gray-900">
                              {persona.title}
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                                {/* {persona.country} */}
                                {persona.location_id}
                              </span>
                            </td>

                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setPersonaFilter(
                                    persona.id
                                  );
                                  setActiveTab(
                                    "prompts"
                                  );
                                }}
                                className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100"
                              >
                                {linkCount} Prompts
                              </button>
                            </td>

                            <td className="p-4 text-gray-500">
                              {new Date(
                                persona.created_at
                              ).toLocaleDateString()}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenPersonaModal(
                                      persona
                                    )
                                  }
                                  title="Edit Persona"
                                >
                                  <Edit2 size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeletePersona(
                                      persona.id
                                    )
                                  }
                                  disabled={
                                    linkCount > 0
                                  }
                                  title={
                                    linkCount > 0
                                      ? "Cannot delete linked persona"
                                      : "Delete Persona"
                                  }
                                  className="disabled:opacity-30"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
  );
}
export default React.memo(PersonasTab)