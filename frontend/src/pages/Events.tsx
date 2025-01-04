import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "../styles/main.scss";

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

      setEvents(uniqueEvents);
    } catch (err) {
      toast.error("Failed to fetch events.");
    }
  }, [token]);

  const saveEvent = async () => {
    try {
      // Verificar conflitos de sobreposição
      const newStart = new Date(startTime);
      const newEnd = new Date(endTime);

      const hasConflict = events.some(
        (existingEvent) =>
          newStart < existingEvent.end &&
          newEnd > existingEvent.start &&
          (!currentEvent || existingEvent.id !== currentEvent.id) // Ignorar o próprio evento ao editar
      );

      if (hasConflict) {
        toast.error("This event conflicts with an existing one!");
        return;
      }

      if (currentEvent) {
        // Editando evento existente
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
        toast.success("Event updated successfully!");
      } else {
        // Criando novo evento
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
        toast.success("Event created successfully!");
      }

      closeModal();
    } catch (err) {
      toast.error("Failed to save event.");
    }
  };

  const deleteEvent = async () => {
    if (!currentEvent) return;
    try {
      await axios.delete(`http://localhost:3000/events/${currentEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((event) => event.id !== currentEvent.id));
      toast.success("Event deleted successfully!");
      closeModal();
    } catch (err) {
      toast.error("Failed to delete event.");
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
    <div className="matrix-events-container">
      <h1 className="matrix-events-title">Your Events</h1>
      <button className="btn matrix-btn mb-3" onClick={() => openModal()}>
        Add Event
      </button>
      {events.length > 0 ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          className="matrix-calendar"
          style={{ height: 500, margin: "50px 0" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) =>
            event.accepted
              ? toast.info("Accepted events cannot be edited or deleted.")
              : openModal(event)
          }
        />
      ) : (
        <p>Loading events...</p>
      )}
      <div className="mt-4">
        <h2 className="matrix-events-title">All Participated Events</h2>
        <ul className="matrix-list">
          {events.map((event) => (
            <li
              key={event.id}
              className="matrix-list-item"
              onClick={
                event.accepted
                  ? () => toast.info("Accepted events cannot be edited.")
                  : () => openModal(event)
              }
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
      </div>
      {showModal && (
        <div className="modal show d-block matrix-modal" tabIndex={-1}>
          <div className="modal-dialog matrix-modal-dialog">
            <div className="modal-content matrix-modal-content">
              <div className="modal-header matrix-modal-header">
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
              <div className="modal-footer matrix-modal-footer">
                {currentEvent && (
                  <button
                    className="btn matrix-btn-delete"
                    onClick={deleteEvent}
                  >
                    Delete
                  </button>
                )}
                <button className="btn matrix-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn matrix-btn-save" onClick={saveEvent}>
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
