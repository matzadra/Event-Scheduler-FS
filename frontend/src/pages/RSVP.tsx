import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Modal, Button, Form, ListGroup, Badge } from "react-bootstrap";

const RSVPPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<any[]>([]);
  const [sentInvites, setSentInvites] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(
        response.data
          .filter((user: any) => user.id !== userId)
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, [token, userId]);

  const fetchInvites = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/events/rsvp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceivedInvites(response.data.received);
      setSentInvites(response.data.sent);
    } catch (err) {
      setError("Failed to fetch invites.");
    }
  }, [token]);

  const fetchUserEvents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEvents(
        response.data.filter((event: any) => event.owner.id === userId)
      );
    } catch (err) {
      setError("Failed to fetch user events.");
    }
  }, [token, userId]);

  useEffect(() => {
    fetchUsers();
    fetchInvites();
  }, [fetchUsers, fetchInvites]);

  const sendInvite = async () => {
    if (!selectedUser || !selectedEventId) return;
    try {
      await axios.post(
        `http://localhost:3000/events/${selectedEventId}/invite`,
        { userId: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchInvites();
    } catch (err) {
      setError("Failed to send invite.");
    }
  };

  const updateInviteStatus = async (
    inviteId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await axios.patch(
        `http://localhost:3000/events/invite/${inviteId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvites();
    } catch (err) {
      setError("Failed to update invite status.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center matrix-style mb-4">RSVP Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {}
      <div className="mb-4">
        <h3 className="matrix-style">Users</h3>
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item
              key={user.id}
              action
              className="matrix-hover"
              onClick={() => {
                setSelectedUser(user.id);
                fetchUserEvents();
                setShowModal(true);
              }}
            >
              {user.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {}
      <div className="mb-4">
        <h3 className="matrix-style">Received Invites</h3>
        {receivedInvites.length === 0 ? (
          <p>No invites received.</p>
        ) : (
          <ListGroup>
            {receivedInvites.map((invite) => (
              <ListGroup.Item key={invite.id}>
                <strong>Event:</strong> {invite.event.description} <br />
                <strong>From:</strong> {invite.inviter.name} <br />
                <Badge bg={invite.status === "pending" ? "warning" : "success"}>
                  {invite.status.toUpperCase()}
                </Badge>
                {invite.status === "pending" && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => updateInviteStatus(invite.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => updateInviteStatus(invite.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {}
      <div className="mb-4">
        <h3 className="matrix-style">Sent Invites</h3>
        {sentInvites.length === 0 ? (
          <p>No invites sent.</p>
        ) : (
          <ListGroup>
            {sentInvites.map((invite) => (
              <ListGroup.Item key={invite.id}>
                <strong>Event:</strong> {invite.event.description} <br />
                <strong>To:</strong> {invite.recipient.name} <br />
                <Badge bg="info">{invite.status.toUpperCase()}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="matrix-modal-header">
          <Modal.Title>Select Event</Modal.Title>
        </Modal.Header>
        <Modal.Body className="matrix-modal-body">
          <Form>
            <Form.Group>
              <Form.Label>Choose an Event</Form.Label>
              <Form.Select
                onChange={(e) => setSelectedEventId(e.target.value)}
                value={selectedEventId || ""}
              >
                <option value="">Select an event...</option>
                {userEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.description} -{" "}
                    {new Date(event.start).toLocaleString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="matrix-modal-footer">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={sendInvite}>
            Send Invite
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RSVPPage;
