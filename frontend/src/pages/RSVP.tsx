import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Modal, Button, Form, ListGroup, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/main.scss";

const RSVPPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<any[]>([]);
  const [sentInvites, setSentInvites] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

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

  const fetchAcceptedInvites = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/events/rsvp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const acceptedEvents = response.data.received
        .filter((invite: any) => invite.status === "accepted")
        .map((invite: any) => ({
          ...invite.event,
          start: new Date(invite.event.startTime),
          end: new Date(invite.event.endTime),
        }));
      setEvents((prevEvents) => [...prevEvents, ...acceptedEvents]);
    } catch (err) {
      setError("Failed to fetch accepted invites.");
    }
  }, [token]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchUsers();
      await fetchInvites();
      await fetchAcceptedInvites();
    };
    fetchAllData();
  }, [fetchUsers, fetchInvites, fetchAcceptedInvites]);

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
      toast.success("Invite sent successfully!");
    } catch (err) {
      setError("Failed to send invite.");
      toast.error("Failed to send invite.");
    }
  };

  const updateInviteStatus = async (
    eventId: string,
    inviteId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      if (status === "accepted") {
        // Fetch de eventos para validação de conflitos
        const fetchedEvents = await axios.get("http://localhost:3000/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedAcceptedInvites = await axios.get(
          "http://localhost:3000/events/rsvp",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const createdEvents = fetchedEvents.data.map((event: any) => ({
          id: event.id,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
        }));

        const acceptedEvents = fetchedAcceptedInvites.data.received
          .filter((invite: any) => invite.status === "accepted")
          .map((invite: any) => ({
            id: invite.event.id,
            start: new Date(invite.event.startTime),
            end: new Date(invite.event.endTime),
          }));

        const allEvents = [...createdEvents, ...acceptedEvents];

        // Encontra o convite atual
        const inviteToCheck = receivedInvites.find(
          (invite: any) => invite.id === inviteId
        );

        if (!inviteToCheck) {
          toast.error("Invite not found for conflict check.");
          return;
        }

        const inviteStartTime = new Date(inviteToCheck.event.startTime);
        const inviteEndTime = new Date(inviteToCheck.event.endTime);

        // Valida conflitos
        const hasConflict = allEvents.some((existingEvent: any) => {
          return (
            existingEvent.start < inviteEndTime &&
            existingEvent.end > inviteStartTime
          );
        });

        if (hasConflict) {
          toast.error("This event conflicts with an existing one!");
          return;
        }
      }

      // Atualiza o status do convite
      await axios.patch(
        `http://localhost:3000/events/${eventId}/invite/${inviteId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza os dados após a ação
      fetchInvites();
      toast.success(
        `Invite ${
          status === "accepted" ? "accepted" : "declined"
        } successfully!`
      );
    } catch (err) {
      toast.error("Failed to update invite status.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center matrix-style mb-4">RSVP Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista de Usuários */}
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

      {/* Convites Recebidos */}
      <div className="mb-4">
        <h3 className="matrix-style">Received Invites</h3>
        {receivedInvites.length === 0 ? (
          <p>No invites received.</p>
        ) : (
          <ListGroup>
            {receivedInvites.map((invite) => (
              <ListGroup.Item key={invite.id} className="matrix-style">
                <strong>Event:</strong> {invite.event.description} <br />
                <strong>Date:</strong>{" "}
                {new Date(invite.event.startTime).toLocaleString()} -{" "}
                {new Date(invite.event.endTime).toLocaleString()} <br />
                <strong>From:</strong> {invite.inviter.name} <br />
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    invite.status === "pending"
                      ? "warning"
                      : invite.status === "accepted"
                      ? "success"
                      : "danger"
                  }
                  className="matrix-badge"
                >
                  {invite.status.toUpperCase()}
                </Badge>
                {invite.status === "pending" && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() =>
                        updateInviteStatus(
                          invite.event.id,
                          invite.id,
                          "accepted"
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() =>
                        updateInviteStatus(
                          invite.event.id,
                          invite.id,
                          "rejected"
                        )
                      }
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

      {/* Convites Enviados */}
      <div className="mb-4">
        <h3 className="matrix-style">Sent Invites</h3>
        {sentInvites.length === 0 ? (
          <p>No invites sent.</p>
        ) : (
          <ListGroup>
            {sentInvites.map((invite) => (
              <ListGroup.Item key={invite.id} className="matrix-style">
                <strong>Event:</strong> {invite.event.description} <br />
                <strong>Date:</strong>{" "}
                {new Date(invite.event.startTime).toLocaleString()} -{" "}
                {new Date(invite.event.endTime).toLocaleString()} <br />
                <strong>To:</strong> {invite.recipient.name} <br />
                <Badge
                  bg={
                    invite.status === "pending"
                      ? "warning"
                      : invite.status === "accepted"
                      ? "success"
                      : "danger"
                  }
                  className="matrix-badge"
                >
                  {invite.status.toUpperCase()}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
