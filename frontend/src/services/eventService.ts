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

export const validateEventConflict = async (
  token: string,
  inviteStartTime: Date,
  inviteEndTime: Date
) => {
  const fetchedEvents = await axios.get("http://localhost:3000/events", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchedAcceptedInvites = await axios.get(
    "http://localhost:3000/events/rsvp",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const createdEvents = fetchedEvents.data.map((event: any) => ({
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  const acceptedEvents = fetchedAcceptedInvites.data.received
    .filter((invite: any) => invite.status === "accepted")
    .map((invite: any) => ({
      start: new Date(invite.event.startTime),
      end: new Date(invite.event.endTime),
    }));

  const allEvents = [...createdEvents, ...acceptedEvents];

  const hasConflict = allEvents.some(
    (existingEvent) =>
      existingEvent.start < inviteEndTime && existingEvent.end > inviteStartTime
  );

  return hasConflict;
};

export const fetchInvites = async (token: string) => {
  const response = await axios.get("http://localhost:3000/events/rsvp", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUserEvents = async (token: string, userId: string) => {
  const response = await axios.get("http://localhost:3000/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.filter((event: any) => event.owner.id === userId);
};

export const sendInvite = async (
  token: string,
  eventId: string,
  userId: string
) => {
  await axios.post(
    `http://localhost:3000/events/${eventId}/invite`,
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const fetchAcceptedInvites = async (token: string) => {
  const response = await axios.get("http://localhost:3000/events/rsvp", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.received
    .filter((invite: any) => invite.status === "accepted")
    .map((invite: any) => ({
      ...invite.event,
      start: new Date(invite.event.startTime),
      end: new Date(invite.event.endTime),
    }));
};

export const updateInviteStatusService = async (
  token: string,
  eventId: string,
  inviteId: string,
  status: "accepted" | "rejected"
) => {
  const response = await axios.patch(
    `http://localhost:3000/events/${eventId}/invite/${inviteId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
