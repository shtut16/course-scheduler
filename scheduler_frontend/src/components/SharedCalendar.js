import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./helper/axiosInstance"; // replace the import
import Calendar from "../components/Calendar";
import MiniNavBar from "./helper/MiniNavBar";
import RecentChanges from './helper/RecentChanges';
import ExportCalendar from './helper/ExportCalendar';
import {Tooltip} from "react-tooltip";  // Import ExportCalendar component

const apiUrl = process.env.REACT_APP_API_URL;
const SharedCalendar = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [showRecentChanges, setShowRecentChanges] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [showExportOptions, setShowExportOptions] = useState(false); // Track visibility of export options
  const [exportFormat, setExportFormat] = useState(null);
  const [shouldExport, setShouldExport] = useState(false);

  // Fetch shared calendar data
  const fetchSharedEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shared-calendar/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendarData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch shared events:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSharedEvents();
  }, [token, navigate, fetchSharedEvents]);

  const handleExportClick = (format) => {
    if (format === "pdf") {
      setShouldExport(true);
    } else if (format === "105.xlx") {
      console.log("Export to 105.xlx is not yet implemented.");
    }
    setShowExportOptions(false);
  };

  const handleCloseExportOptions = () => {
    setShowExportOptions(false); // Close the export options modal
  };

  return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2>FORDHAM CS DEPARTMENT COURSE SCHEDULER</h2>
        </div>

        {/* Navigation Bar */}
        <MiniNavBar/>

        <div style={styles.mainContent}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            {["viewPast", "recentChanges", "export"].map((label) => (
                <button
                    key={label}
                    style={{
                      ...styles.sidebarButton,
                      backgroundColor: hoveredButton === label ? "#ADD8E6" : "#eee",
                      color: hoveredButton === label ? "white" : "black",
                    }}
                    onMouseEnter={() => setHoveredButton(label)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => {
                      if (label === "recentChanges") {
                        setShowRecentChanges((prev) => !prev); // Toggle visibility of RecentChanges
                      } else if (label === "export") {
                        setShowExportOptions(true); // Show export options when 'Export' is clicked
                      }
                    }}
                >
                  {label === "viewPast"
                      ? "View Past Versions"
                      : label === "recentChanges"
                          ? "View Recent Changes"
                          : "Export"}
                </button>
            ))}
          </div>

          {/* Toggleable Recent Changes Section */}
          {showRecentChanges && (
              <div style={styles.recentChangesContainer}>
                <RecentChanges/> {/* This will display your RecentChanges component */}
              </div>
          )}

          {/* Export Options Modal */}
          {showExportOptions && (
              <>
                <div className="modal-backdrop" onClick={handleCloseExportOptions}></div>
                {/* Modal backdrop */}
                <div className="export-options-container">
                  <h3>Export Calendar</h3>
                  <button onClick={() => handleExportClick("pdf")}>Export as PDF</button>
                  <button onClick={() => handleExportClick("105.xlx")}>Export as 105.xlx</button>
                  <button className="close-button" onClick={handleCloseExportOptions}>X</button>
                </div>
              </>
          )}

          {/* Calendar Section */}
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              {["showComments", "approve"].map((label) => (
                  <button
                      key={label}
                      style={{
                        ...styles.button,
                        backgroundColor: hoveredButton === label ? "#ADD8E6" : "white",
                        color: hoveredButton === label ? "white" : "black",
                      }}
                      onMouseEnter={() => setHoveredButton(label)}
                      onMouseLeave={() => setHoveredButton(null)}
                  >
                    {label === "showComments" ? "Show Comments" : "Approve (2/6)"}
                  </button>
              ))}
            </div>

            <div style={styles.calendarSection}>
              <div id="calendar">
                <h3 data-tooltip-id="shared-cal-tip"
                    data-tooltip-content="This calendar displays events shared by all users.
                    Use it to coordinate and avoid conflicts."
                >
                  Shared Calendar
                </h3>
                <Tooltip id="shared-cal-tip" />
                <Calendar
                    events={calendarData || []}
                    calendarType="shared"
                    onEventDeleted={fetchSharedEvents} // 🔁 Refresh after delete
                />
              </div>
            </div>
          </div>
        </div>

        {calendarData && (
          <div id="hidden-calendar" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
            <Calendar
              events={calendarData}
              calendarType="shared"
              height="auto"
              slotMinTime="08:00:00"
              slotMaxTime="23:00:00"
              initialView="timeGridWeek"
            />
          </div>
        )}

        {/* Trigger ExportCalendar as needed */}
        {exportFormat && (
            <ExportCalendar
                events={calendarData || []}
                format={exportFormat}
                onDone={() => setExportFormat(null)} // Reset after export
            />
        )}

        {shouldExport && (
          <>
            <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
              <Calendar
                events={calendarData}
                calendarType="shared"
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="23:00:00"
                initialView="timeGridWeek"
              />
            </div>
            <ExportCalendar
              events={calendarData}
              format="pdf"
              onDone={() => setShouldExport(false)}
            />
          </>
        )}
      </div>
  );
};

// Styles for the non-modal elements
const styles = {
  container: {fontFamily: "Arial, sans-serif", width: "100%", textAlign: "center"},
  header: {padding: "10px", fontSize: "20px", fontWeight: "bold"},
  mainContent: {display: "flex", marginTop: "50px"},
  sidebar: { width: "20%", display: "flex", flexDirection: "column", padding: "10px" },
  sidebarButton: {
    margin: "10px 0",
    padding: "10px",
    background: "#eee",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  calendarSection: { width: "80%", padding: "10px", marginTop: "-40px" },
  calendarHeader: { display: "flex", justifyContent: "flex-end", marginBottom: "10px", paddingRight: "110px" },
  button: { margin: "0 10px", padding: "5px 10px", background: "white", border: "1px solid black", cursor: "pointer" },
};

export default SharedCalendar;
