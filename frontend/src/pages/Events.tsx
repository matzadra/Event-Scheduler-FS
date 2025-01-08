import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "react-big-calendar";

import { useAuth } from "../contexts/AuthContext";
import { localizer } from "../utils/calendarLocalizer";
import { eventStyleGetter } from "../utils/eventStyles";
import { showError, showSuccess, showInfo } from "../utils/toastMessages";

import {
  getCreatedEvents,
  getAcceptedEvents,
  createEvent,
  updateEvent,
  deleteEventById,
  parseAcceptedEvents,
  parseCreatedEvents,
} from "../services/eventService";

import EventFormModal from "../components/events/EventFormModal";
import EventList from "../components/events/EventList";

import { Event } from "../types/event";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/main.scss";

const Events: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!token) return;

    try {
      const createdEvents = await getCreatedEvents(token);
      const acceptedEvents = await getAcceptedEvents(token);
      const parsedCreatedEvents = parseCreatedEvents(createdEvents);
      const parsedAcceptedEvents = parseAcceptedEvents(acceptedEvents);

      const uniqueEvents = Array.from(
        new Map(
          [...parsedCreatedEvents, ...parsedAcceptedEvents].map((event) => [
            event.id,
            event,
          ])
        ).values()
      );

      setEvents(uniqueEvents);
    } catch (err) {
      showError("Failed to fetch events.");
    }
  }, [token]);

  const handleSaveEvent = async (newEvent: {
    description: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!token) return;

    try {
      if (currentEvent) {
        const updatedEvent = await updateEvent(
          token,
          currentEvent.id,
          newEvent
        );
        setEvents((prev) =>
          prev.map((event) =>
            event.id === currentEvent.id
              ? {
                  ...updatedEvent,
                  start: new Date(updatedEvent.startTime),
                  end: new Date(updatedEvent.endTime),
                  title: updatedEvent.description,
                }
              : event
          )
        );
        showSuccess("Event updated successfully!");
      } else {
        const createdEvent = await createEvent(token, newEvent);
        setEvents((prev) => [
          ...prev,
          {
            ...createdEvent,
            start: new Date(createdEvent.startTime),
            end: new Date(createdEvent.endTime),
            title: createdEvent.description,
          },
        ]);
        showSuccess("Event created successfully!");
      }
    } catch (err) {
      showError("Failed to save event.");
    } finally {
      setShowModal(false);
      setCurrentEvent(null);
    }
  };

  const handleDeleteEvent = useCallback(async () => {
    if (!currentEvent || !token) return;
    try {
      await deleteEventById(token, currentEvent.id);
      setEvents((prev) => prev.filter((event) => event.id !== currentEvent.id));
      showSuccess("Event deleted successfully!");
    } catch (err) {
      showError("Failed to delete event.");
    } finally {
      setShowModal(false);
      setCurrentEvent(null);
    }
  }, [currentEvent, token]);

  const handleDelete = useCallback(() => {
    if (currentEvent && !currentEvent.accepted) handleDeleteEvent(); // Only allow deletion if the user owns the event (not accepted from an invitation)
  }, [currentEvent, handleDeleteEvent]);

  const openModal = (event?: Event) => {
    setCurrentEvent(event || null);
    setShowModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentEvent(null);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="matrix-events-container">
      <h1 className="matrix-events-title">Your Events</h1>
      <button
        className="btn matrix-btn mb-3"
        onClick={() => openModal()}
        aria-label="Add Event"
        title="Add Event"
      >
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
          aria-label="Event Calendar"
          onSelectEvent={(event) =>
            event.accepted
              ? showInfo("Accepted events cannot be edited or deleted.")
              : openModal(event)
          }
        />
      ) : (
        <p>Loading events...</p>
      )}
      <div className="mt-4">
        <h2 className="matrix-events-title">All Participated Events</h2>
        <EventList
          events={events}
          onSelect={(event) =>
            event.accepted
              ? showInfo("Accepted events cannot be edited.")
              : openModal(event)
          }
        />
      </div>
      <EventFormModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDelete}
        initialData={
          currentEvent
            ? {
                description: currentEvent.title,
                startTime: currentEvent.start.toISOString().slice(0, 16),
                endTime: currentEvent.end.toISOString().slice(0, 16),
              }
            : undefined
        }
      />
    </div>
  );
};

export default Events;
