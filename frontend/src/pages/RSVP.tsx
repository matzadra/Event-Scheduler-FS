import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const RSVPPage = () => {
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchInvites = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/events/rsvp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceivedInvites(response.data.received);
      setSentInvites(response.data.sent);
    } catch (err) {
      setError("Failed to fetch invites");
    }
  }, [token]);

  const updateInviteStatus = async (
    eventId: string,
    inviteId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await axios.patch(
        `http://localhost:3000/events/${eventId}/invite/${inviteId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchInvites();
    } catch (err) {
      setError("Failed to update invite status");
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  return (
    <div className="container">
      <h1>RSVP</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Received Invites</h2>
      <ul className="list-group">
        {receivedInvites.map((invite: any) => (
          <li key={invite.id} className="list-group-item">
            <strong>{invite.event.description}</strong> <br />
            Invited by: {invite.inviter.name} <br />
            Status: {invite.status}
            <div>
              {invite.status === "pending" && (
                <>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() =>
                      updateInviteStatus(invite.event.id, invite.id, "accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      updateInviteStatus(invite.event.id, invite.id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2>Sent Invites</h2>
      <ul className="list-group">
        {sentInvites.map((invite: any) => (
          <li key={invite.id} className="list-group-item">
            <strong>{invite.event.description}</strong> <br />
            Sent to: {invite.recipient.name} <br />
            Status: {invite.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSVPPage;
