import { Dispatch, SetStateAction } from "react"
import { Modal } from "../modal"
import { AlertCircle } from "lucide-react"

interface CreatePeronaModalProps {
    isDisableModalOpen: boolean
    setDisableModalOpen: Dispatch<SetStateAction<boolean>>
    confirmDisable: () => void
    targetPromptIds: string[] 
    disableRationale: string
    setDisableRationale: Dispatch<SetStateAction<string>>
}

const DisableConfirmationModal = ({
    isDisableModalOpen,
    setDisableModalOpen,
    confirmDisable,
    targetPromptIds,
    disableRationale,
    setDisableRationale
}: CreatePeronaModalProps) => {
    return <Modal
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
}
export default DisableConfirmationModal