interface Event {
  accepted?: boolean;
}

const eventColors = {
  created: "#00ff8a",
  accepted: "#008C4A",
};

export const eventStyleGetter = (event: Event) => {
  const backgroundColor = event.accepted
    ? eventColors.accepted
    : eventColors.created;

  return {
    style: {
      backgroundColor,
      color: "#121212",
      borderRadius: "5px",
      border: "none",
      padding: "5px",
    },
  };
};
