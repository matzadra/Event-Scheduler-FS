// src/components/rsvp/SentInvitesList.tsx
import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { SentInvite } from "../../types/invites";

interface SentInvitesListProps {
  sentInvites: SentInvite[];
}

const SentInvitesList: React.FC<SentInvitesListProps> = ({ sentInvites }) => {
  if (sentInvites.length === 0) {
    return <p>No invites sent.</p>;
  }

  return (
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
  );
};

export default SentInvitesList;
