import React from "react";

interface FeedbackMessageProps {
  message: string;
  type: "success" | "error";
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message, type }) => {
  const className = type === "success" ? "matrix-success" : "matrix-error";
  return <p className={`text-center ${className}`}>{message}</p>;
};

export default FeedbackMessage;
