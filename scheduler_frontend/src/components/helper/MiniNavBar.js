import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MiniNavBar = () => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const location = useLocation();

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "center",
      padding: "10px",
      background: "#f0f0f0",
    },
    tab: {
      padding: "10px 15px",         // space inside the tab
      margin: "5px",                // space around the tab
      textDecoration: "none",       // removes underline on Link
      color: "black",               // text color
      backgroundColor: "white",     // background color
      border: "1px solid #ccc",     // border style (can be none)
      borderRadius: "10px",         // roundness of corners (0 = sharp, higher = more round)
      boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", // subtle shadow for depth
      fontWeight: "bold",           // makes text bold
      fontSize: "14px",             // font size
      transition: "all 0.2s ease",  // smooth animation on hover/focus
      cursor: "pointer",            // pointer cursor
      display: "flex",
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: "#C4E4C4", // light green
    },
    hoverTab: {
      backgroundColor: "#ADD8E6", // light blue
    },
    badge: {
      background: "red",
      color: "white",
      padding: "3px 8px",
      borderRadius: "50%",
      fontSize: "12px",
      marginLeft: "5px",
    },
  };

  const getTabStyle = (path, key) => {
    const isActive = location.pathname === path;
    const isHovered = hoveredTab === key;
    return {
      ...styles.tab,
      ...(isActive ? styles.activeTab : {}),
      ...(!isActive && isHovered ? styles.hoverTab : {}),
    };
  };

  return (
    <div style={styles.navbar}>
      <Link
        to="/shared-cal"
        style={getTabStyle("/shared-cal", "shared")}
        onMouseEnter={() => setHoveredTab("shared")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        Shared Calendar
      </Link>

      <Link
        to="/my-cal"
        style={getTabStyle("/my-cal", "my")}
        onMouseEnter={() => setHoveredTab("my")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        My Calendars
      </Link>

      <Link
        to="/conflicts"
        style={getTabStyle("/conflicts", "conflicts")}
        onMouseEnter={() => setHoveredTab("conflicts")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        Conflicts <span style={styles.badge}>0</span>
      </Link>

      <Link
        to="/requests"
        style={getTabStyle("/requests", "requests")}
        onMouseEnter={() => setHoveredTab("requests")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        Requests <span style={styles.badge}>2</span>
      </Link>

      <Link
        to="/profile"
        style={getTabStyle("/profile", "profile")}
        onMouseEnter={() => setHoveredTab("profile")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        Profile
      </Link>
    </div>
  );
};

export default MiniNavBar;
