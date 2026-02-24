"use client"
import React, {
  useState,
  useMemo,
  JSX,
} from "react";

import {
  Search,
  Plus,
  Filter,
  Copy,
  Ban,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Cpu,
  Trash2,
  Edit2,
  Info,
} from "lucide-react";
import { ActionType, LogEntry, Persona, PersonaFormData, Prompt, PromptFormData, Status } from "./types/types";
import { COUNTRIES, INITIAL_PERSONAS, INITIAL_TAGS, LLM_MODELS, MOCK_LOGS, MOCK_PROMPTS } from "./constants/constants";
import { Modal } from "./components/modal";
import { PersonaSelector } from "./components/personaSelector";
import { TagInput } from "./components/tagInput";

function PromptManagementUI(): JSX.Element {

  const [activeTab, setActiveTab] =
    useState<"prompts" | "personas" | "history">(
      "prompts"
    );

  const [prompts, setPrompts] =
    useState<Prompt[]>(MOCK_PROMPTS);

  const [personas, setPersonas] =
    useState<Persona[]>(INITIAL_PERSONAS);

  const [logs, setLogs] =
    useState<LogEntry[]>(MOCK_LOGS);

  const [globalTags, setGlobalTags] =
    useState<string[]>(INITIAL_TAGS);

  /* =========================
     FILTER STATE
  ========================= */

  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const [personaSearchQuery, setPersonaSearchQuery] =
    useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<Status | "All">("Active");

  const [modelFilter, setModelFilter] =
    useState<string>("");

  const [personaFilter, setPersonaFilter] =
    useState<string>("");

  /* =========================
     SELECTION STATE
  ========================= */

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  /* =========================
     MODAL STATE
  ========================= */

  const [isCreatePromptModalOpen,
    setCreatePromptModalOpen] =
    useState<boolean>(false);

  const [isPersonaModalOpen,
    setPersonaModalOpen] =
    useState<boolean>(false);

  const [isDisableModalOpen,
    setDisableModalOpen] =
    useState<boolean>(false);

  /* =========================
     ACTION STATE
  ========================= */

  const [targetPromptIds,
    setTargetPromptIds] =
    useState<string[]>([]);

  const [disableRationale,
    setDisableRationale] =
    useState<string>("");

  /* =========================
     FORM STATE
  ========================= */

  const [promptFormData,
    setPromptFormData] =
    useState<PromptFormData>({
      question: "",
      models: [],
      personas: [],
      tags: [],
      isDisabled: false,
    });

  const [personaFormData,
    setPersonaFormData] =
    useState<PersonaFormData>({
      id: null,
      title: "",
      country: "Global",
      description: "",
    });

  /* =====================================================
     CORE LOGIC
  ===================================================== */

  const addLog = (
    actionType: ActionType,
    details: string,
    rationale: string | null = null
  ): void => {
    const newLog: LogEntry = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: "current_user",
      action_type: actionType,
      details,
      rationale,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  /* =========================
     FILTERED PROMPTS
  ========================= */

  const filteredPrompts: Prompt[] =
    useMemo(() => {
      return prompts
        .filter((p) => {
          const matchesSearch =
            p.question
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              );

          const matchesStatus =
            statusFilter === "All" ||
            p.status === statusFilter;

          const matchesModel =
            modelFilter === "" ||
            p.models.includes(modelFilter);

          const matchesPersona =
            personaFilter === "" ||
            p.personas.includes(personaFilter);

          return (
            matchesSearch &&
            matchesStatus &&
            matchesModel &&
            matchesPersona
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        );
    }, [
      prompts,
      searchQuery,
      statusFilter,
      modelFilter,
      personaFilter,
    ]);

  /* =========================
     FILTERED PERSONAS
  ========================= */

  const filteredPersonas: Persona[] =
    useMemo(() => {
      return personas.filter(
        (p) =>
          p.title
            .toLowerCase()
            .includes(
              personaSearchQuery.toLowerCase()
            ) ||
          p.country
            .toLowerCase()
            .includes(
              personaSearchQuery.toLowerCase()
            )
      );
    }, [personas, personaSearchQuery]);

  const getLinkedPromptCount = (
    personaId: string
  ): number => {
    return prompts.filter((p) =>
      p.personas.includes(personaId)
    ).length;
  };

  /* =========================
     BULK SELECTION
  ========================= */

  const toggleSelection = (
    id: string
  ): void => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id)
        ? newSet.delete(id)
        : newSet.add(id);
      return newSet;
    });
  };

  const toggleAll = (): void => {
    if (
      selectedIds.size ===
      filteredPrompts.length
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(
          filteredPrompts.map(
            (p) => p.id
          )
        )
      );
    }
  };

  /* =========================
     PROMPT FLOW
  ========================= */

  const handleOpenCreatePrompt = (
    cloneData: Prompt | null = null
  ): void => {
    if (cloneData) {
      setPromptFormData({
        question: cloneData.question,
        models: cloneData.models,
        personas: cloneData.personas,
        tags: cloneData.tags,
        isDisabled: false,
      });
    } else {
      setPromptFormData({
        question: "",
        models: [],
        personas: [],
        tags: [],
        isDisabled: false,
      });
    }

    setCreatePromptModalOpen(true);
  };

  const handleSubmitPrompt =
    (): void => {
      const newTags =
        promptFormData.tags.filter(
          (t) =>
            !globalTags.includes(t)
        );

      if (newTags.length > 0) {
        setGlobalTags((prev) => [
          ...prev,
          ...newTags,
        ]);

        addLog(
          "Tag Creation",
          `Created new tags: ${newTags.join(
            ", "
          )}`
        );
      }

      const newPrompt: Prompt = {
        id: `p-${Date.now()}`,
        question:
          promptFormData.question,
        models:
          promptFormData.models,
        personas:
          promptFormData.personas,
        tags:
          promptFormData.tags,
        created_at:
          new Date().toISOString(),
        status:
          promptFormData.isDisabled
            ? "Disabled"
            : "Active",
      };

      setPrompts((prev) => [
        newPrompt,
        ...prev,
      ]);

      addLog(
        "Addition",
        `Created prompt ${newPrompt.id}`
      );

      setCreatePromptModalOpen(false);
    };

  /* =========================
     PERSONA FLOW
  ========================= */

  const handleOpenPersonaModal = (
    persona: Persona | null = null
  ): void => {
    if (persona) {
      setPersonaFormData({
        id: persona.id,
        title: persona.title,
        country: persona.country,
        description:
          persona.description,
      });
    } else {
      setPersonaFormData({
        id: null,
        title: "",
        country: "Global",
        description: "",
      });
    }

    setPersonaModalOpen(true);
  };

  const handleSubmitPersona =
    (): void => {
      if (personaFormData.id) {
        setPersonas((prev) =>
          prev.map((p) =>
            p.id ===
            personaFormData.id
              ? {
                  ...p,
                  title:
                    personaFormData.title,
                  country:
                    personaFormData.country,
                  description:
                    personaFormData.description,
                }
              : p
          )
        );

        addLog(
          "Enabling",
          `Updated Persona: ${personaFormData.title}`
        );
      } else {
        const newPersona: Persona =
          {
            id: `per-${Date.now()}`,
            title:
              personaFormData.title,
            country:
              personaFormData.country,
            description:
              personaFormData.description,
            created_at:
              new Date().toISOString(),
          };

        setPersonas((prev) => [
          newPersona,
          ...prev,
        ]);

        addLog(
          "Addition",
          `Created Persona: ${newPersona.title}`
        );
      }

      setPersonaModalOpen(false);
    };

  const handleDeletePersona = (
    id: string
  ): void => {
    const count =
      getLinkedPromptCount(id);

    if (count > 0) {
      alert(
        `Cannot delete Persona. Linked to ${count} prompts.`
      );
      return;
    }

    setPersonas((prev) =>
      prev.filter((p) => p.id !== id)
    );

    addLog(
      "Disabling",
      `Deleted Persona ID: ${id}`
    );
  };

  const handleCreateNewPersonaFromPrompt =
    (): void => {
      setCreatePromptModalOpen(
        false
      );
      setActiveTab("personas");
      handleOpenPersonaModal();
    };

  /* =========================
     DISABLE FLOW
  ========================= */

  const initiateDisable = (
    ids: string[]
  ): void => {
    setTargetPromptIds(ids);
    setDisableRationale("");
    setDisableModalOpen(true);
  };

  const confirmDisable =
    (): void => {
      setPrompts((prev) =>
        prev.map((p) =>
          targetPromptIds.includes(
            p.id
          )
            ? {
                ...p,
                status: "Disabled",
              }
            : p
        )
      );

      targetPromptIds.forEach(
        (id) =>
          addLog(
            "Disabling",
            `Disabled prompt ${id}`,
            disableRationale
          )
      );

      setDisableModalOpen(false);
      setSelectedIds(new Set());
    };

  const handleAggregateAnalytics =
    (): void => {
      alert(
        `Opening analytics for IDs: ${Array.from(
          selectedIds
        ).join(", ")}`
      );
    };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* =========================
          TOP NAVIGATION
      ========================== */}
      
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Cpu className="text-blue-600" />
              <h1 className="text-xl font-bold tracking-tight">
                Prompt Manager
              </h1>
            </div>

            <nav className="flex space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab("prompts")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "prompts"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Prompts
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("personas")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "personas"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Personas
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "history"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                History Logs
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === "prompts" && (
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
                {LLM_MODELS.map((m) => (
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
        )}
                {/* =========================
            PERSONAS TAB
        ========================== */}

        {activeTab === "personas" && (
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
                                {persona.country}
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
        )}
                {/* =========================
            HISTORY TAB
        ========================== */}

        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              System Audit Log
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="relative pl-8"
                >
                  <div
                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ${
                      log.action_type ===
                      "Disabling"
                        ? "bg-red-500"
                        : log.action_type ===
                          "Addition"
                        ? "bg-green-500"
                        : log.action_type ===
                          "Tag Creation"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">
                        {log.action_type}
                      </span>

                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(
                          log.timestamp
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        User: {log.user_id}
                      </span>

                      {log.rationale && (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                          Rationale: {log.rationale}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
              </main>

      {/* =====================================================
          CREATE / CLONE PROMPT MODAL
      ===================================================== */}

      <Modal
        isOpen={isCreatePromptModalOpen}
        onClose={() =>
          setCreatePromptModalOpen(false)
        }
        title="Create Prompt"
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() =>
                setCreatePromptModalOpen(false)
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmitPrompt}
              disabled={
                !promptFormData.question.trim()
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50"
            >
              Submit Prompt
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Prompt Question
            </label>
            <textarea
              rows={4}
              value={promptFormData.question}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement>
              ) =>
                setPromptFormData({
                  ...promptFormData,
                  question: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Models */}
          <div>
            <label className="block text-sm font-medium mb-2">
              LLM Models
            </label>

            <div className="space-y-2 border p-3 rounded-md">
              {LLM_MODELS.map((model) => (
                <label
                  key={model}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={promptFormData.models.includes(
                      model
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPromptFormData({
                          ...promptFormData,
                          models: [
                            ...promptFormData.models,
                            model,
                          ],
                        });
                      } else {
                        setPromptFormData({
                          ...promptFormData,
                          models:
                            promptFormData.models.filter(
                              (m) => m !== model
                            ),
                        });
                      }
                    }}
                  />
                  {model}
                </label>
              ))}
            </div>
          </div>

          {/* Personas */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Personas
            </label>

            <PersonaSelector
              value={promptFormData.personas}
              personas={personas}
              onChange={(ids) =>
                setPromptFormData({
                  ...promptFormData,
                  personas: ids,
                })
              }
              onCreateNew={
                handleCreateNewPersonaFromPrompt
              }
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags
            </label>

            <TagInput
              value={promptFormData.tags}
              availableTags={globalTags}
              onChange={(tags) =>
                setPromptFormData({
                  ...promptFormData,
                  tags,
                })
              }
            />
          </div>

          {/* Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <h4 className="text-sm font-medium">
                Disable on creation
              </h4>
              <p className="text-xs text-gray-500">
                Draft mode
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setPromptFormData({
                  ...promptFormData,
                  isDisabled:
                    !promptFormData.isDisabled,
                })
              }
              className={`h-6 w-11 rounded-full ${
                promptFormData.isDisabled
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            />
          </div>
        </div>
      </Modal>

      {/* =====================================================
          PERSONA MODAL
      ===================================================== */}

      <Modal
        isOpen={isPersonaModalOpen}
        onClose={() =>
          setPersonaModalOpen(false)
        }
        title={
          personaFormData.id
            ? "Edit Persona"
            : "Create Persona"
        }
        footer={
          <>
            <button
              type="button"
              onClick={() =>
                setPersonaModalOpen(false)
              }
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmitPersona}
              disabled={
                !personaFormData.title.trim() ||
                !personaFormData.country
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {personaFormData.id
                ? "Save Changes"
                : "Create Persona"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={personaFormData.title}
            onChange={(e) =>
              setPersonaFormData({
                ...personaFormData,
                title: e.target.value,
              })
            }
            className="w-full border p-2 rounded-md"
          />

          <select
            value={personaFormData.country}
            onChange={(e) =>
              setPersonaFormData({
                ...personaFormData,
                country: e.target.value,
              })
            }
            className="w-full border p-2 rounded-md"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <textarea
            rows={4}
            value={personaFormData.description}
            onChange={(e) =>
              setPersonaFormData({
                ...personaFormData,
                description: e.target.value,
              })
            }
            className="w-full border p-2 rounded-md"
          />

          {personaFormData.id && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <Info size={14} />
              Updating affects attached prompts.
            </p>
          )}
        </div>
      </Modal>

      {/* =====================================================
          DISABLE CONFIRMATION MODAL
      ===================================================== */}

      <Modal
        isOpen={isDisableModalOpen}
        onClose={() =>
          setDisableModalOpen(false)
        }
        title="Confirm Deactivation"
        footer={
          <>
            <button
              type="button"
              onClick={() =>
                setDisableModalOpen(false)
              }
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDisable}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Confirm Disable
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-4 bg-red-50 rounded-md">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">
                Disabling{" "}
                {targetPromptIds.length} prompt(s)
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Optional rationale"
            value={disableRationale}
            onChange={(e) =>
              setDisableRationale(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-md"
          />
        </div>
      </Modal>

    </div>
  );
}
export default PromptManagementUI