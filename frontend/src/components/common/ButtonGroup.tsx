import React from "react";
import { Link } from "react-router-dom";

interface ButtonGroupProps {
  buttons: { label: string; path: string }[];
  className?: string;
  buttonClassName?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  className,
  buttonClassName,
}) => {
  return (
    <div className={className}>
      {buttons.map((button, index) => (
        <Link key={index} to={button.path}>
          <button className={buttonClassName}>{button.label}</button>
        </Link>
      ))}
    </div>
  );
};

export default ButtonGroup;
