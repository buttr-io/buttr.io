"use client"
import { useState, useMemo, JSX, useEffect } from "react";

import { Cpu } from "lucide-react";
import { ActionType, Country, LocationLevel, LogEntry, Persona, PersonaFormData, Prompt, PromptFormData, Status } from "./types/types";
import { INITIAL_PERSONAS, INITIAL_TAGS, LLM_MODELS, MOCK_LOGS, MOCK_PROMPTS } from "./constants/constants";
import CreatePromptModal from "./components/modals/CreatePromptModal";
import CreatePersonaModal from "./components/modals/CreatePersonaModal";
import DisableConfirmationModal from "./components/modals/DisableConfirmationModal";
import PromptsTab from "./components/tabs/PromptsTab";
import PersonasTab from "./components/tabs/PersonasTab";
import HistoryTab from "./components/tabs/HistoryTab";
import { getLocations } from "../services/client-side-serivices/locations/locations";


function PromptManagementUI(): JSX.Element {
    
    const [activeTab, setActiveTab] = useState<"prompts" | "personas" | "history">("prompts");
    
    const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);

    const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);

    const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
    
    const [globalTags, setGlobalTags] = useState<string[]>(INITIAL_TAGS);
    
    const [locations, setLocations] = useState<Country[]>([]);

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
        location_id: "",
        location_level: LocationLevel.COUNTRY,
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
            p.location_id
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
            location_id: persona.location_id,
            location_level: persona.location_level,
            description:
            persona.description,
        });
        } else {
        setPersonaFormData({
            id: null,
            title: "",
            location_id: "",
            location_level: LocationLevel.COUNTRY,
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
                        personaFormData.location_id,
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
                location_id:
                personaFormData.location_id,
                location_level:
                personaFormData.location_level,
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
    
    useEffect(() => {
        getLocations().then(res=> {
            setLocations(res)
        })
    },[])

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
          <PromptsTab 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            modelFilter={modelFilter}
            setModelFilter={setModelFilter}
            personaFilter={personaFilter}
            setPersonaFilter={setPersonaFilter}
            selectedIds={selectedIds}
            toggleSelection={toggleSelection}
            toggleAll={toggleAll}
            filteredPrompts={filteredPrompts}
            personas={personas}
            llmModels={LLM_MODELS}
            handleOpenCreatePrompt={handleOpenCreatePrompt}
            initiateDisable={initiateDisable}
            handleAggregateAnalytics={handleAggregateAnalytics}
          />
          )}
        {/* =========================
            PERSONAS TAB
        ========================== */}

        {activeTab === "personas" && (
            <PersonasTab
                personaSearchQuery={personaSearchQuery}
                setPersonaSearchQuery={setPersonaSearchQuery}
                filteredPersonas={filteredPersonas}
                getLinkedPromptCount={getLinkedPromptCount}
                handleOpenPersonaModal={handleOpenPersonaModal}
                handleDeletePersona={handleDeletePersona}
                setPersonaFilter={setPersonaFilter}
                setActiveTab={setActiveTab}
            />
        )}
                {/* =========================
            HISTORY TAB
        ========================== */}

        {activeTab === "history" && (
            <HistoryTab
                logs={logs}
            />
        )}
              </main>

      {/* =====================================================
          CREATE / CLONE PROMPT MODAL
      ===================================================== */}

        <CreatePromptModal
            isCreatePromptModalOpen={isCreatePromptModalOpen}
            setCreatePromptModalOpen={setCreatePromptModalOpen}
            handleSubmitPrompt={handleSubmitPrompt}
            promptFormData={promptFormData}
            setPromptFormData={setPromptFormData}
            personas={personas}
            handleCreateNewPersonaFromPrompt={handleCreateNewPersonaFromPrompt}
            globalTags={globalTags}
        />

      {/* =====================================================
          PERSONA MODAL
      ===================================================== */}

        <CreatePersonaModal 
            isPersonaModalOpen={isPersonaModalOpen}
            setPersonaModalOpen={setPersonaModalOpen}
            personaFormData={personaFormData}
            handleSubmitPersona={handleSubmitPersona}
            setPersonaFormData={setPersonaFormData}
            locations={locations}
        />

        <DisableConfirmationModal
            isDisableModalOpen={isDisableModalOpen}
            setDisableModalOpen={setDisableModalOpen}
            confirmDisable={confirmDisable}
            targetPromptIds={targetPromptIds}
            disableRationale={disableRationale}
            setDisableRationale={setDisableRationale}
        />
    </div>
  );
}
export default PromptManagementUI