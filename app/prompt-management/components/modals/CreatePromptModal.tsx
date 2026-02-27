import { SetStateAction } from "react";
import { LLM_MODELS } from "../../constants/constants";
import { Modal } from "../modal";
import { PersonaSelector } from "../personaSelector";
import { TagInput } from "../tagInput";
import { Persona, PromptFormData } from "../../types/types";

interface Props {
    isCreatePromptModalOpen: boolean
    setCreatePromptModalOpen:  React.Dispatch<SetStateAction<boolean>>
    handleSubmitPrompt: () => void
    promptFormData: PromptFormData
    setPromptFormData: React.Dispatch<SetStateAction<PromptFormData>>
    personas: Persona[]
    handleCreateNewPersonaFromPrompt: () => void
    globalTags: string[]
}

const CreatePromptModal = (
    {isCreatePromptModalOpen, setCreatePromptModalOpen, handleSubmitPrompt, promptFormData, setPromptFormData, personas, handleCreateNewPersonaFromPrompt, globalTags}: Props
) => {

    return (
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
              <h4 className="text-sm font-medium text-gray-900">Disable on creation</h4>
              <p className="text-xs text-gray-500">Draft mode: Prompt will not be available in API.</p>
            </div>
            <button 
              onClick={() => setPromptFormData({...promptFormData, isDisabled: !promptFormData.isDisabled})}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${promptFormData.isDisabled ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${promptFormData.isDisabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </Modal>
    )
}
export default CreatePromptModal