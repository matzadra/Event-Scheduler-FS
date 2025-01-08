import React, { useState } from "react";

interface EventFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (event: {
    description: string;
    startTime: string;
    endTime: string;
  }) => void;
  onDelete?: () => void;
  initialData?: { description: string; startTime: string; endTime: string };
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  show,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");

  const handleSave = () => {
    onSave({ description, startTime, endTime });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block matrix-modal" tabIndex={-1}>
      <div className="modal-dialog matrix-modal-dialog">
        <div className="modal-content matrix-modal-content">
          <div className="modal-header matrix-modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Event" : "Add Event"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer matrix-modal-footer">
            {onDelete && (
              <button className="btn matrix-btn-delete" onClick={onDelete}>
                Delete
              </button>
            )}
            <button className="btn matrix-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn matrix-btn-save" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;
