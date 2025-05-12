// Calendar.js
// Renders a weekly calendar view using FullCalendar, displaying events fetched from an API.
// Events are normalized before rendering. Clicking an event opens a modal with detailed info, and users can
// delete events. Supports both user-specific and shared calendars, based on the `calendarType` prop.

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import axios from "./helper/axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;

const Calendar = ({ events = [], calendarType, onEventDeleted }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event data

  // Function to handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event); // Store the event that was clicked
    setModalIsOpen(true); // Open the modal
  };

  const normalizeEvent = (event) => {
    console.log('Raw event:', event);

    const { days, times } = event;

    if (!times) {
      console.error('No times found for event:', event);
      return event;
    }

    const validDayCodes = {
      M: 1, T: 2, W: 3, R: 4, F: 5, S: 6, U: 0
    };

    const weekdayIndexes = [...days].map(day => {
      if (!(day in validDayCodes)) {
        console.error(`Invalid day code: ${day}`);
      }
      return validDayCodes[day];
    });

    const [startTime, endTime] = times.split('-');

    return {
      ...event,
      daysOfWeek: weekdayIndexes,
      startTime,
      endTime,
      allDay: false,
    };
  };

  // Normalize all events for FullCalendar
  const normalizedEvents = events.map(normalizeEvent);

  // Map of user to color for event display
  const userColorMapping = {
    'user1': '#FF5733', // Example color for user1
    'user2': '#33FF57', // Example color for user2
    'user3': '#3357FF', // Example color for user3
  };

  // Function to get event color based on the user
  const getEventColor = (user) => {
    return userColorMapping[user] || '#7D7D7D'; // Default color if no user match
  };

  return (
    <div style={{ width: "80%", height: "400px", margin: "auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate="2025-01-06"
        slotMinTime="08:00:00"  // Start at 8 AM
        slotMaxTime="23:00:00"  // End at 11 PM
        events={events.length > 0 ? normalizedEvents : []}
        headerToolbar={false}
        footerToolbar={false}
        eventClick={handleEventClick} // Open the modal when an event is clicked
        weekends={true}
        aspectRatio={2}
        dayHeaderFormat={{ weekday: 'short' }} // Show abbreviated weekday names (e.g., "Sun", "Mon")
        eventClassNames={(event) => {
          return ['event-user-color']; // Use a custom class for each event
        }}
        eventContent={(content) => {
          const user = content.event.extendedProps?.user; // Safely access user
          const backgroundColor = user ? getEventColor(user) : '#7D7D7D'; // Default color if user is undefined
          return (
            <div style={{ backgroundColor, color: 'white' }}>
              <p>{content.event.extendedProps?.course_number}</p>
            </div>
          );
        }}
      />

      {events.length === 0 && (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          No events to display for this {calendarType} calendar.
        </p>
      )}

      {/* Modal for displaying event details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Event Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedEvent && (
          <div className="modal-content">
            <h2>{selectedEvent.extendedProps?.course_title}</h2> {/* Show course title */}
            <p><strong>Course Number:</strong> {selectedEvent.extendedProps?.course_number}</p> {/* Show course number */}
            <p><strong>Instructor:</strong> {selectedEvent.extendedProps?.instructor}</p> {/* Show instructor */}
            <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> {/* Show only the time */}
            <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> {/* Show only the time */}
            <p><strong>Created By:</strong> {selectedEvent.extendedProps?.user || 'Unknown'}</p> {/* Safely display user info */}
            <p><strong>Details:</strong> {selectedEvent.extendedProps?.course_description || 'No description available'}</p> {/* Show course description */}
            <button className="close-btn" onClick={() => setModalIsOpen(false)}>Close</button>
            <button
              className="delete-btn"
              onClick={async () => {
                try {
                  await axios.delete(`${apiUrl}/api/events/${selectedEvent.id}/`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                  });
                  setModalIsOpen(false);
                  setSelectedEvent(null);
                  if (typeof onEventDeleted === "function") {
                    onEventDeleted(); // Trigger refresh from parent
                  }
                } catch (error) {
                  console.error("Failed to delete event:", error);
                }
              }}
            >
              Delete Event
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
