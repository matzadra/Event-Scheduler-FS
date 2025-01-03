import React from "react";
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

const CustomCalendar = ({
  events,
  onSelectEvent,
  onDeleteEvent,
}: {
  events: any[];
  onSelectEvent: (event: any) => void;
  onDeleteEvent: (event: any) => void;
}) => {
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: "#00ff8a",
        color: "#121212",
        borderRadius: "5px",
        padding: "5px",
        border: "none",
      },
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500, margin: "50px" }}
      eventPropGetter={eventStyleGetter}
      onSelectEvent={(event) => {
        if (
          window.confirm("Edit or Delete? Click OK for Edit, Cancel for Delete")
        ) {
          onSelectEvent(event);
        } else {
          onDeleteEvent(event);
        }
      }}
    />
  );
};

export default CustomCalendar;
