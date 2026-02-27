import { Info } from "lucide-react"
import { Modal } from "../modal"
import { Dispatch, SetStateAction } from "react"
import { Country, PersonaFormData } from "../../types/types"

interface CreatePeronaModalProps {
    isPersonaModalOpen: boolean
    setPersonaModalOpen: Dispatch<SetStateAction<boolean>>
    personaFormData: PersonaFormData
    handleSubmitPersona: () => void
    setPersonaFormData: Dispatch<SetStateAction<PersonaFormData>>
    locations: Country[]
}

const CreatePersonaModal = ({
    isPersonaModalOpen,
    setPersonaModalOpen,
    personaFormData,
    handleSubmitPersona,
    setPersonaFormData,
    locations
  }: CreatePeronaModalProps) => {

    return (<Modal
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
                !personaFormData.location_id
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
            value={personaFormData.location_id}
            onChange={(e) =>
              setPersonaFormData({
                ...personaFormData,
                location_id: e.target.value,
              })
            }
            className="w-full border p-2 rounded-md"
          >
            {/* FIX: THESE ARE COUNTRIES. We need to nest all of them*/}
            {locations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
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
    )
}

export default CreatePersonaModal