import React from "react";
import { ListGroup, Badge, Button } from "react-bootstrap";
import { ReceivedInvite } from "../../types/invites";

interface ReceivedInviteProps {
  invites: ReceivedInvite[];
  updateStatus: (
    eventId: string,
    inviteId: string,
    status: "accepted" | "rejected"
  ) => void;
}

export const ReceivedInviteList: React.FC<ReceivedInviteProps> = ({
  invites,
  updateStatus,
}) => (
  <ListGroup>
    {invites.map((invite) => (
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
                updateStatus(invite.event.id, invite.id, "accepted")
              }
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="ms-2"
              onClick={() =>
                updateStatus(invite.event.id, invite.id, "rejected")
              }
            >
              Reject
            </Button>
          </>
        )}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default ReceivedInviteList;
