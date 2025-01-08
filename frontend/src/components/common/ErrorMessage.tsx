import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <p className="matrix-error text-center">{message}</p>;
};

export default ErrorMessage;
