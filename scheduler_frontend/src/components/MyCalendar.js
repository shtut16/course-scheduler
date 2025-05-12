import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import axios from "./helper/axiosInstance"; // replace the import
import Calendar from "../components/Calendar"; // Import the Calendar component
import MiniNavBar from "./helper/MiniNavBar";
import EventForm from './helper/EventForm'; // EVENTFORM
import ExportCalendar from './helper/ExportCalendar';  // Import ExportCalendar component
import { Tooltip } from 'react-tooltip';

const apiUrl = process.env.REACT_APP_API_URL;
const MyCalendar = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [calendarData, setCalendarData] = useState(null); // Store user-specific calendar data
  const navigate = useNavigate();
  const [pushStatus, setPushStatus] = useState(null); // State to track push success/error message
  const [pushMessage, setPushMessage] = useState(""); // State to store the message
  const token = localStorage.getItem("access_token");
  const [isLoading, setIsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false); // EVENTFORM
  const [showExportOptions, setShowExportOptions] = useState(false); // Track visibility of export options
  const [exportFormat, setExportFormat] = useState(null);
  const [shouldExport, setShouldExport] = useState(false);

    // Fetch calendar data for the logged-in user (personal calendar)
    const fetchCalendarData = useCallback(async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/my-calendar/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCalendarData(response.data);
      } catch (error) {
        console.error("Error fetching calendar data", error);
      }
    }, [token]); // token is a dependency

    useEffect(() => {
      if (!token) {
        navigate("/login");
        return;
      }

      fetchCalendarData();
    }, [token, navigate, fetchCalendarData]);

  // Function to create a new event
  const createEvent = async () => {
    const newEvent = {
      course_number: "CS1000",
      course_title: "Test Course",
      instructor: "Jane Doe",
      days: "MWF",
      times: "09:00-10:00",
      course_description: "This is a test event.",
      is_shared: false
    };

    try {
      // Make a POST request to create a new event in the backend
      await axios.post(`${apiUrl}/api/events/`, newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Use fetchCalendarData to refresh the event list after the new event is created
      fetchCalendarData(); // Re-fetch the updated calendar data

    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Function to push calendar events to shared calendar
  const pushToSharedCalendar = async () => {
    setIsLoading(true); // Start loading

    try {
      // Send a POST request to push calendar data to shared calendar
      const response = await axios.post(
        `${apiUrl}/api/push-to-shared/`,
        { events: calendarData }, // Send all events as one object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      if (response.status === 200) {
        setPushStatus("success");
        setPushMessage("Successfully pushed to the shared calendar!");

        // Use fetchCalendarData to refresh the calendar data after successful push
        fetchCalendarData(); // Re-fetch the updated calendar data
      }
    } catch (error) {
      // Handle error
      setPushStatus("error");
      setPushMessage("Failed to push to the shared calendar. Please try again.");
      console.error("Error pushing to shared calendar:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

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
      <div>
        <MiniNavBar /> {/* Use the MiniNavbar here */}
      </div>
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button
              style={{
                ...styles.sidebarButton,
                backgroundColor: hoveredButton === "viewPast" ? "#ADD8E6" : "#eee", // Light blue on hover
                color: hoveredButton === "viewPast" ? "white" : "black",
              }}
              onMouseEnter={() => setHoveredButton("viewPast")}
              onMouseLeave={() => setHoveredButton(null)}
          >
            Create New Calendar
          </button>

          <button onClick={() => setShowEventForm(!showEventForm)}
          style={{
            ...styles.sidebarButton,
            backgroundColor: hoveredButton === "createEvent" ? "#ADD8E6" : "#eee", // Light blue on hover
            color: hoveredButton === "createEvent" ? "white" : "black",
          }}
          onMouseEnter={() => setHoveredButton("createEvent")}
          onMouseLeave={() => setHoveredButton(null)}
          >
            {showEventForm ? 'Close Event Form' : 'Create Event'}
          </button>

          <button
              onClick={createEvent}
              style={{
                ...styles.sidebarButton,
                backgroundColor: hoveredButton === "createTestEvent" ? "#ADD8E6" : "#eee",
                color: hoveredButton === "createTestEvent" ? "white" : "black",
              }}
              onMouseEnter={() => setHoveredButton("createTestEvent")}
              onMouseLeave={() => setHoveredButton(null)}
          >
            + Create Test Event
          </button>
          <button
              style={{
                ...styles.sidebarButton,
                backgroundColor: hoveredButton === "recentChanges" ? "#ADD8E6" : "#eee", // Light blue on hover
                color: hoveredButton === "recentChanges" ? "white" : "black",
              }}
              onMouseEnter={() => setHoveredButton("recentChanges")}
              onMouseLeave={() => setHoveredButton(null)}
          >
            Import
          </button>
          <button
              style={{
                ...styles.sidebarButton,
                backgroundColor: hoveredButton === "export" ? "#ADD8E6" : "#eee", // Light blue on hover
                color: hoveredButton === "export" ? "white" : "black",
              }}
              onMouseEnter={() => setHoveredButton("export")}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => {
                  setShowExportOptions(true); // Show export options when 'Export' is clicked
                }
              }
          >
            Export
          </button>
        </div>

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
            <button
                style={{
                  ...styles.button,
                  backgroundColor: hoveredButton === "showComments" ? "#ADD8E6" : "white", // Light blue on hover
                  color: hoveredButton === "showComments" ? "white" : "black",
                }}
                onMouseEnter={() => setHoveredButton("showComments")}
                onMouseLeave={() => setHoveredButton(null)}
            >
              Show Comments
            </button>
            <button
                style={{
                  ...styles.button,
                  backgroundColor: hoveredButton === "approve" ? "#ADD8E6" : "white", // Light blue on hover
                  color: hoveredButton === "approve" ? "white" : "black",
              }}
              onMouseEnter={() => setHoveredButton("approve")}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={pushToSharedCalendar} // Call the function when clicked

              data-tooltip-id="push-tip"
              data-tooltip-content="This will publish your entire calendar to the shared calendar.
              Others will be able to see all your events."
            >
              Push to Shared Calendar
            </button>
            <Tooltip id="push-tip" />
          </div>

          {/*loading spinner*/}
          {isLoading && (
            <div style={{ marginTop: "20px" }}>
              <div className="spinner" />
              <p>Pushing to shared calendar...</p>
            </div>
          )}

          {/* Calendar Display */}
          <div style={styles.calendarSection}>
            <div id="calendar">
              <h3 data-tooltip-id="my-cal-tip"
                  data-tooltip-content="This is your personal calendar. You can create and manage events here,
                  and optionally push them to the shared calendar."
              >
                My Calendar
              </h3>
              <Tooltip id="my-cal-tip" />
              {calendarData === null ? (
                  <Calendar calendarType="personal"/> // Display a blank calendar if no data is available
              ) : (
                  <Calendar
                      events={calendarData}
                      calendarType="personal"
                      onEventDeleted={async () => {
                        try {
                          const response = await axios.get(`${apiUrl}/api/my-calendar/`, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          setCalendarData(response.data); // 🔁 Refresh calendar after deletion
                        } catch (error) {
                          console.error("Error refreshing calendar after deletion", error);
                        }
                      }}
                  />
              )}
            </div>

            {/* Display success or error message */}
            {pushStatus && (
                <div
                    style={{
                      marginTop: "20px",
                      padding: "10px",
                      backgroundColor: pushStatus === "success" ? "#d4edda" : "#f8d7da",
                      color: pushStatus === "success" ? "#155724" : "#721c24",
                      borderRadius: "5px",
                      border: pushStatus === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
                    }}
                >
                  {pushMessage}
                </div>
            )}

            {showEventForm && (
                <EventForm
                    onCreateEvent={async (newEventData) => {
                      try {
                        await axios.post(`${apiUrl}/api/events/`, newEventData, {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                          },
                        });
                        setShowEventForm(false);
                        fetchCalendarData();
                      } catch (error) {
                        console.error("Failed to create event:", error);
                      }
                    }}
                    onClose={() => setShowEventForm(false)} // 👈 add this line
                />
            )}

            {calendarData && (
                <div id="hidden-calendar" style={{position: 'absolute', top: '-9999px', left: '-9999px'}}>
                  <Calendar
                      events={calendarData}
                      calendarType="personal"
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
                  <div style={{position: "absolute", top: "-9999px", left: "-9999px"}}>
                    <Calendar
                        events={calendarData}
                        calendarType="personal"
                        height="auto"
                        slotMinTime="08:00:00"
                        slotMaxTime="23:00:00"
                        initialView="timeGridWeek"
                    />
                  </div>
                  <ExportCalendar
                      events={calendarData}
                      format="pdf"
                      onDone={() => setShouldExport(false)} // Reset after export
                  />
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: { fontFamily: "Arial, sans-serif", width: "100%", textAlign: "center" },
  header: { padding: "10px", fontSize: "20px", fontWeight: "bold" },
  tab: { padding: "10px 15px", margin: "5px", border: "none", background: "white", cursor: "pointer" },
  activeTab: { padding: "10px 15px", margin: "5px", border: "none", background: "#C4E4C4", cursor: "pointer" },
  badge: { background: "red", color: "white", padding: "3px 8px", borderRadius: "50%", fontSize: "12px" },
  mainContent: { display: "flex", marginTop: "50px" },
  sidebar: { width: "20%", display: "flex", flexDirection: "column", padding: "10px" },
  sidebarButton: { margin: "10px 0", padding: "10px", background: "#eee", border: "1px solid #ccc", cursor: "pointer" },
  calendarSection: { width: "80%", padding: "10px", marginTop: "-40px" },
  calendarHeader: { display: "flex", justifyContent: "flex-end", marginBottom: "10px", paddingRight: "110px" },
  button: { margin: "0 10px", padding: "5px 10px", background: "white", border: "1px solid black", cursor: "pointer" },
  calendar: { width: "80%", margin: "auto", borderCollapse: "collapse" },
};

export default MyCalendar;
