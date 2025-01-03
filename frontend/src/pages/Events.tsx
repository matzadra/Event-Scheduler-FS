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
      const response = await axios.get("http://localhost:3000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedEvents = response.data.map((event: any) => ({
        ...event,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to fetch events");
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
      setDescription(event.description);
      setStartTime(dateToLocalInputValue(new Date(event.startTime)));
      setEndTime(dateToLocalInputValue(new Date(event.endTime)));
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

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#00ff8a",
        color: "#121212",
        borderRadius: "5px",
        border: "none",
        padding: "5px",
      },
    };
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container">
      <h1>Your Events</h1>
      <button className="btn btn-primary mb-3" onClick={() => openModal()}>
        Add Event
      </button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px 0" }}
        onSelectEvent={openModal}
        eventPropGetter={eventStyleGetter}
      />

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ zIndex: 1050 }}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: "#1a1a1a", // Fundo escuro
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "#2c2c2c", // Fundo escuro do modal
                color: "#ffffff", // Texto claro
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentEvent ? "Edit Event" : "Add Event"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  style={{
                    backgroundColor: "#444", // Botão de fechar com fundo escuro
                    color: "#fff", // Texto branco
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label style={{ color: "#cccccc" }}>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      border: "1px solid #555",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: "#cccccc" }}>Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      border: "1px solid #555",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: "#cccccc" }}>End Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      border: "1px solid #555",
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                {currentEvent && (
                  <button
                    className="btn btn-danger"
                    onClick={deleteEvent}
                    style={{ borderRadius: "5px" }}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={closeModal}
                  style={{
                    backgroundColor: "#444",
                    color: "#ffffff",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={saveEvent}
                  style={{
                    backgroundColor: "#00cc44",
                    color: "#ffffff",
                    borderRadius: "5px",
                  }}
                >
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
