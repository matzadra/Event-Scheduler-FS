import axios from "axios";
import { EVENT_COLORS } from "../constants/colors";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getCreatedEvents = async (token: string) => {
  const response = await api.get("/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAcceptedEvents = async (token: string) => {
  const response = await api.get("/events/rsvp", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.received;
};

export const createEvent = async (
  token: string,
  event: { description: string; startTime: string; endTime: string }
) => {
  const response = await api.post("/events", event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateEvent = async (
  token: string,
  eventId: string,
  event: { description: string; startTime: string; endTime: string }
) => {
  const response = await api.patch(`/events/${eventId}`, event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteEventById = async (token: string, eventId: string) => {
  await api.delete(`/events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const parseCreatedEvents = (events: any[]) =>
  events.map((event) => ({
    id: event.id,
    title: event.description,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    color: EVENT_COLORS.CREATED,
    accepted: false,
  }));

export const parseAcceptedEvents = (invites: any[]) =>
  invites
    .filter((invite) => invite.status === "accepted")
    .map((invite) => ({
      id: invite.event.id,
      title: invite.event.description,
      start: new Date(invite.event.startTime),
      end: new Date(invite.event.endTime),
      color: EVENT_COLORS.ACCEPTED,
      accepted: true,
      inviterName: invite.inviter.name,
    }));
