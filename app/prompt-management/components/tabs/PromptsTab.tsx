import React from "react";
import {
  Search,
  Plus,
  Filter,
  Copy,
  Ban,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Prompt, Persona, Status } from "../../types/types";

interface PromptsTabProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: Status | "All";
  setStatusFilter: React.Dispatch<
    React.SetStateAction<Status | "All">
  >;

  modelFilter: string;
  setModelFilter: React.Dispatch<
    React.SetStateAction<string>
  >;

  personaFilter: string;
  setPersonaFilter: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  toggleAll: () => void;

  filteredPrompts: Prompt[];
  personas: Persona[];
  llmModels: string[];

  handleOpenCreatePrompt: (clone?: Prompt | null) => void;
  initiateDisable: (ids: string[]) => void;
  handleAggregateAnalytics: () => void;
}

function PromptsTab({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  modelFilter,
  setModelFilter,
  personaFilter,
  setPersonaFilter,
  selectedIds,
  toggleSelection,
  toggleAll,
  filteredPrompts,
  personas,
  llmModels,
  handleOpenCreatePrompt,
  initiateDisable,
  handleAggregateAnalytics,
}: PromptsTabProps) {
  return (
    <div className="space-y-6">

            {/* =========================
                HEADER ACTIONS
            ========================== */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-lg w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search prompt questions..."
                  value={searchQuery}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  handleOpenCreatePrompt()
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                <Plus size={18} />
                Add Prompt
              </button>
            </div>

            {/* =========================
                FILTER BAR
            ========================== */}

            <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 mr-2">
                <Filter size={16} />
                <span>Filters:</span>
              </div>

              <select
                value={statusFilter}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) =>
                  setStatusFilter(
                    e.target.value as Status | "All"
                  )
                }
                className="text-sm border-gray-300 rounded-md border px-3 py-1.5 focus:ring-blue-500"
              >
                <option value="Active">
                  Status: Active
                </option>
                <option value="Disabled">
                  Status: Disabled
                </option>
                <option value="All">
                  Status: All
                </option>
              </select>

              <select
                value={modelFilter}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) => setModelFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md border px-3 py-1.5 focus:ring-blue-500"
              >
                <option value="">
                  All Models
                </option>
                {llmModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={personaFilter}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) =>
                  setPersonaFilter(e.target.value)
                }
                className="text-sm border-gray-300 rounded-md border px-3 py-1.5 focus:ring-blue-500"
              >
                <option value="">
                  All Personas
                </option>
                {personas.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* =========================
                BULK ACTION BAR
            ========================== */}

            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {selectedIds.size}
                  </span>
                  <span className="text-sm font-medium text-indigo-900">
                    items selected
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={
                      handleAggregateAnalytics
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-md"
                  >
                    <BarChart2 size={16} />
                    Aggregate Analytics
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      initiateDisable(
                        Array.from(selectedIds)
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-md"
                  >
                    <Ban size={16} />
                    Bulk Disable
                  </button>
                </div>
              </div>
            )}

            {/* =========================
                TABLE
            ========================== */}

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.size ===
                              filteredPrompts.length &&
                            filteredPrompts.length > 0
                          }
                          onChange={toggleAll}
                          className="rounded border-gray-300 text-blue-600"
                        />
                      </th>

                      <th className="p-4 font-medium w-1/3">
                        Prompt Question
                      </th>
                      <th className="p-4 font-medium">
                        Status
                      </th>
                      <th className="p-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredPrompts.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-gray-500"
                        >
                          No prompts found.
                        </td>
                      </tr>
                    ) : (
                      filteredPrompts.map(
                        (prompt) => (
                          <tr
                            key={prompt.id}
                            className={`hover:bg-gray-50 ${
                              prompt.status ===
                              "Disabled"
                                ? "opacity-60"
                                : ""
                            }`}
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(
                                  prompt.id
                                )}
                                onChange={() =>
                                  toggleSelection(
                                    prompt.id
                                  )
                                }
                              />
                            </td>

                            <td className="p-4">
                              {prompt.question}
                            </td>

                            <td className="p-4">
                              {prompt.status}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenCreatePrompt(
                                      prompt
                                    )
                                  }
                                >
                                  <Copy size={16} />
                                </button>

                                {prompt.status ===
                                  "Active" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      initiateDisable(
                                        [
                                          prompt.id,
                                        ]
                                      )
                                    }
                                  >
                                    <Ban size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Placeholder */}

              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  {filteredPrompts.length} results
                </div>
                <div className="flex gap-1">
                  <button disabled>
                    <ChevronLeft size={20} />
                  </button>
                  <button>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
    );
}

export default React.memo(PromptsTab)