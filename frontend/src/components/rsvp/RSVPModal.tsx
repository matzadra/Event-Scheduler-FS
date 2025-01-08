import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface RSVPModalProps {
  show: boolean;
  onClose: () => void;
  onSend: () => void;
  userEvents: any[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string) => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({
  show,
  onClose,
  onSend,
  userEvents,
  selectedEventId,
  setSelectedEventId,
}) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton className="matrix-modal-header">
      <Modal.Title>Select Event</Modal.Title>
    </Modal.Header>
    <Modal.Body className="matrix-modal-body">
      <Form>
        <Form.Group>
          <Form.Select
            onChange={(e) => setSelectedEventId(e.target.value)}
            value={selectedEventId || ""}
          >
            <option value="">Select an event...</option>
            {userEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.description} -{" "}
                {new Date(event.startTime).toLocaleString()} to{" "}
                {new Date(event.endTime).toLocaleString()}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer className="matrix-modal-footer">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSend}>
        Send Invite
      </Button>
    </Modal.Footer>
  </Modal>
);

export default RSVPModal;
