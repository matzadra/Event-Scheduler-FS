import React from "react";
import TypingText from "../components/common/TypingText";
import ButtonGroup from "../components/common/ButtonGroup";
import "../styles/main.scss";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="matrix-title">
        <TypingText text="Event Scheduler" className="typing-effect" />
      </h1>
      <p className="matrix-subtitle">
        Plan, manage, and keep track of your events with ease.
      </p>
      <ButtonGroup
        buttons={[
          { label: "Login", path: "/login" },
          { label: "Register", path: "/register" },
        ]}
        className="matrix-btn-group"
        buttonClassName="matrix-hover"
      />
    </div>
  );
};

export default Home;
