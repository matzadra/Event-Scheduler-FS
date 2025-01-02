import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Events = () => {
  interface Event {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // ID do evento sendo editado

  const token = localStorage.getItem("token");

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events");
    }
  }, [token]); // Token é uma dependência necessária

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        // Edição de evento
        const response = await axios.patch(
          `http://localhost:3000/events/${editingEventId}`,
          { description, startTime, endTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(
          events.map((event) =>
            event.id === editingEventId ? response.data : event
          )
        );
      } else {
        // Criação de novo evento
        const response = await axios.post(
          "http://localhost:3000/events",
          { description, startTime, endTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents([...events, response.data]);
      }
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save event");
    }
  };

  const editEvent = (event: any) => {
    setEditingEventId(event.id); // Define o ID do evento a ser editado
    setDescription(event.description);
    setStartTime(new Date(event.startTime).toISOString().slice(0, 16)); // Formata para datetime-local
    setEndTime(new Date(event.endTime).toISOString().slice(0, 16)); // Formata para datetime-local
    setShowForm(true);
  };

  const resetForm = () => {
    setDescription("");
    setStartTime("");
    setEndTime("");
    setEditingEventId(null);
    setShowForm(false);
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`http://localhost:3000/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container">
      <h1>Your Events</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        {showForm ? "Cancel" : "Create Event"}
      </button>

      {showForm && (
        <form onSubmit={saveEvent}>
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
          <button type="submit" className="btn btn-success">
            {editingEventId ? "Save Changes" : "Save Event"}
          </button>
        </form>
      )}

      <ul className="list-group">
        {events.map((event: any) => (
          <li key={event.id} className="list-group-item">
            <strong>{event.description}</strong> <br />
            {new Date(event.startTime).toLocaleString()} -{" "}
            {new Date(event.endTime).toLocaleString()}
            <button
              className="btn btn-secondary btn-sm float-end ms-2"
              onClick={() => editEvent(event)} // Preenche o formulário com os dados do evento
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm float-end"
              onClick={() => deleteEvent(event.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
