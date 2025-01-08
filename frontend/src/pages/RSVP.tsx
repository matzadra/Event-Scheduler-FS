import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "../styles/main.scss";
import {
  showError,
  showSuccess,
  showDynamicToast,
  updateToast,
} from "../utils/toastMessages";
import { useAuth } from "../contexts/AuthContext";
import { ReceivedInvite, SentInvite } from "../types/invites";
import { fetchUsers } from "../services/userService";
import {
  fetchInvites,
  fetchAcceptedInvites,
  fetchUserEvents,
  sendInvite,
  updateInviteStatusService,
  validateEventConflict,
} from "../services/eventService";
import ReceivedInviteList from "../components/rsvp/ReceivedInvitesList";
import SentInvitesList from "../components/rsvp/SentInvitesList";
import RSVPModal from "../components/rsvp/RSVPModal";

const RSVPPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  const { token } = useAuth();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token || !userId) {
        showError("User authentication error.");
        return;
      }
      try {
        const users = await fetchUsers(token, userId);
        setUsers(users);

        const invites = await fetchInvites(token);
        setReceivedInvites(invites.received);
        setSentInvites(invites.sent);

        setSelectedUser(userId);
        const userEvents = await fetchUserEvents(token, userId);
        setUserEvents(userEvents);

        const acceptedEvents = await fetchAcceptedInvites(token);
        setEvents((prevEvents) => [...prevEvents, ...acceptedEvents]);
      } catch (error) {
        showError("Failed to fetch data.");
      }
    };
    fetchAllData();
  }, [token, userId]);

  const updateInviteStatus = async (
    eventId: string,
    inviteId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      if (status === "accepted") {
        const inviteToCheck = receivedInvites.find(
          (invite: any) => invite.id === inviteId
        );

        if (!inviteToCheck) {
          showError("Invite not found for conflict check.");
          return;
        }

        const inviteStartTime = new Date(inviteToCheck.event.startTime);
        const inviteEndTime = new Date(inviteToCheck.event.endTime);

        const hasConflict = await validateEventConflict(
          token!,
          inviteStartTime,
          inviteEndTime
        );

        if (hasConflict) {
          showError("This event conflicts with an existing one!");
          return;
        }
      }

      await updateInviteStatusService(token!, eventId, inviteId, status);

      await fetchInvites(token!);
      showSuccess(
        `Invite ${
          status === "accepted" ? "accepted" : "declined"
        } successfully!`
      );
    } catch (err) {
      showError("Failed to update invite status.");
    }
  };

  const handleSendInvite = async () => {
    if (!token || !selectedEventId || !selectedUser) {
      showError("Missing required information to send an invite.");
      return;
    }
    setIsSending(true);
    const processingToastId = showDynamicToast("Sending invite...", {
      autoClose: false,
      type: "info",
    });
    try {
      await sendInvite(token, selectedEventId, selectedUser);
      const invites = await fetchInvites(token);
      setSentInvites(invites.sent);
      updateToast(processingToastId, {
        render: "Invite sent successfully!",
        type: "success",
        autoClose: 3000,
      });
      setSelectedEventId(null);
      setShowModal(false);
    } catch (err) {
      updateToast(processingToastId, {
        render: "Failed to send invite.",
        type: "error",
        autoClose: false,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center matrix-style mb-4">RSVP Management</h1>
      <div className="mb-4">
        <h3 className="matrix-style">Users</h3>
        <ListGroup>
          {users.length > 0 ? (
            users.map((user) => (
              <ListGroup.Item
                key={user.id}
                action
                className="matrix-hover"
                onClick={() => {
                  setSelectedUser(user.id);
                  setShowModal(true);
                }}
              >
                {user.name}
              </ListGroup.Item>
            ))
          ) : (
            <p>Loading users list...</p>
          )}
        </ListGroup>
      </div>
      <div className="mb-4">
        <h3 className="matrix-style">Received Invites</h3>
        {receivedInvites.length === 0 ? (
          <p>No invites received.</p>
        ) : (
          <ReceivedInviteList
            invites={receivedInvites}
            updateStatus={updateInviteStatus}
          />
        )}
      </div>
      <div className="mb-4">
        <h3 className="matrix-style">Sent Invites</h3>
        <SentInvitesList sentInvites={sentInvites} />
      </div>
      <RSVPModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEventId(null);
        }}
        onSend={handleSendInvite}
        userEvents={userEvents}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        isSending={isSending}
      />
    </div>
  );
};

export default RSVPPage;
