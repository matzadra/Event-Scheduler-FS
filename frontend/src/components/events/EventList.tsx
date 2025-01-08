import React from "react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  inviterName?: string;
  accepted?: boolean;
}

interface EventListProps {
  events: Event[];
  onSelect: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onSelect }) => {
  return (
    <ul className="matrix-list">
      {events.map((event) => (
        <li
          key={event.id}
          className="matrix-list-item"
          onClick={() => onSelect(event)}
        >
          <strong>{event.title}</strong> <br />
          From: {event.start.toLocaleString()} <br />
          To: {event.end.toLocaleString()} <br />
          {event.accepted && (
            <p>
              <strong>Invited By:</strong> {event.inviterName}
            </p>
          )}
          <span
            className={`badge matrix-badge ${
              event.accepted ? "bg-info" : "bg-success"
            }`}
          >
            {event.accepted ? "Accepted Invite" : "Created"}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
