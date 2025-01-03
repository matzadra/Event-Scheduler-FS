import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Events = () => {
  interface Event {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    start: Date;
    end: Date;
    title: string;
    inviterName?: string; // Nome do convidador (inviter)
    accepted?: boolean; // Indica se o evento foi aceito
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const token = localStorage.getItem("token");

  const dateToLocalInputValue = (date: Date) => {
    const offsetMs = date.getTimezoneOffset() * 60000;
    const local = new Date(date.getTime() - offsetMs);
    return local.toISOString().slice(0, 16);
  };

  const fetchEvents = useCallback(async () => {
    try {
      const createdResponse = await axios.get("http://localhost:3000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const acceptedResponse = await axios.get(
        "http://localhost:3000/events/rsvp",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdEvents = createdResponse.data.map((event: any) => ({
        id: event.id,
        title: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        color: "#00ff8a",
        accepted: false,
      }));

      const acceptedEvents = acceptedResponse.data.received
        .filter((invite: any) => invite.status === "accepted")
        .map((invite: any) => ({
          id: invite.event.id,
          title: invite.event.description,
          start: new Date(invite.event.startTime),
          end: new Date(invite.event.endTime),
          color: "#008C4A", // Cor diferenciada para eventos aceitos
          accepted: true, // Flag indicando evento aceito
          inviterName: invite.inviter.name, // Nome do convidador (inviter)
        }));

      const uniqueEvents = Array.from(
        new Map(
          [...createdEvents, ...acceptedEvents].map((event) => [
            event.id,
            event,
          ])
        ).values()
      );
      console.log(uniqueEvents);
      console.log(createdEvents);

      setEvents(uniqueEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, [token]);

  const saveEvent = async () => {
    try {
      if (currentEvent) {
        const response = await axios.patch(
          `http://localhost:3000/events/${currentEvent.id}`,
          { description, startTime, endTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents((prev) =>
          prev.map((event) =>
            event.id === currentEvent.id
              ? {
                  ...response.data,
                  start: new Date(response.data.startTime),
                  end: new Date(response.data.endTime),
                  title: response.data.description,
                }
              : event
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:3000/events",
          { description, startTime, endTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents((prev) => [
          ...prev,
          {
            ...response.data,
            start: new Date(response.data.startTime),
            end: new Date(response.data.endTime),
            title: response.data.description,
          },
        ]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save event");
    }
  };

  const deleteEvent = async () => {
    if (!currentEvent) return;
    try {
      await axios.delete(`http://localhost:3000/events/${currentEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((event) => event.id !== currentEvent.id));
      closeModal();
    } catch (err) {
      console.error("Failed to delete event");
    }
  };

  const openModal = (event?: Event) => {
    if (event) {
      setCurrentEvent(event);
      setDescription(event.description || event.title);
      setStartTime(dateToLocalInputValue(event.start));
      setEndTime(dateToLocalInputValue(event.end));
    } else {
      setCurrentEvent(null);
      setDescription("");
      setStartTime("");
      setEndTime("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDescription("");
    setStartTime("");
    setEndTime("");
    setCurrentEvent(null);
  };

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: event.color,
      color: "#121212",
      borderRadius: "5px",
      border: "none",
      padding: "5px",
    },
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container">
      <h1>Your Events</h1>
      <button className="btn btn-primary mb-3" onClick={() => openModal()}>
        Add Event
      </button>
      {events.length > 0 ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: 500, margin: "50px 0" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) =>
            event.accepted ? undefined : openModal(event)
          }
        />
      ) : (
        <p>Loading events...</p>
      )}
      <div className="mt-4">
        <h2>All Participated Events</h2>
        <ul className="list-group matrix-style">
          {events.map((event) => (
            <li
              key={event.id}
              className="list-group-item matrix-hover"
              onClick={event.accepted ? undefined : () => openModal(event)}
              style={{ cursor: "pointer" }}
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
                className={`badge ${event.accepted ? "bg-info" : "bg-success"}`}
              >
                {event.accepted ? "Accepted Invite" : "Created"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ zIndex: 1050 }}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              className="modal-content"
              style={{ backgroundColor: "#2c2c2c", color: "#ffffff" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentEvent ? "Edit Event" : "Add Event"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
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
              <div className="modal-footer">
                {currentEvent && (
                  <button className="btn btn-danger" onClick={deleteEvent}>
                    Delete
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
