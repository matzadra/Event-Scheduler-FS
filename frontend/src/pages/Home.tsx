import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.scss";

const Home = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Event Scheduler";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <h1 className="matrix-title">{typedText}</h1>
      <p className="matrix-subtitle">
        Plan, manage, and keep track of your events with ease.
      </p>
      <div className="matrix-btn-group">
        <Link to="/login">
          <button className="matrix-hover">Login</button>
        </Link>
        <Link to="/register">
          <button className="matrix-hover">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
