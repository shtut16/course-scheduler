// ExportButton.js
// A component that provides an "Export" button for exporting the calendar data in different
// formats (PDF or 105.xlsx).
// The component displays options for exporting once the user clicks the "Export" button.

import React, { useState } from "react";
import ExportCalendar from './ExportCalendar';  // Import the ExportCalendar component for PDF export

const ExportButton = ({ calendarData }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExportClick = (format) => {
    if (format === "pdf") {
      // Call the ExportCalendar component to generate PDF
      ExportCalendar({ events: calendarData, format: "pdf" });
    } else if (format === "105.xlsx") {
      // Placeholder for the 105.xlsx export functionality
      console.log("Export to 105.xlsx is not yet implemented.");
    }
    setShowExportOptions(false); // Hide export options after selection
  };

  return (
    <div style={styles.exportButtonContainer}>
      <button
        onClick={() => setShowExportOptions(true)}
        style={styles.button}
      >
        Export
      </button>

      {/* Export Options */}
      {showExportOptions && (
        <div style={styles.exportOptionsContainer}>
          <h3>Export Calendar</h3>
          <button onClick={() => handleExportClick("pdf")} style={styles.optionButton}>Export as PDF</button>
          <button onClick={() => handleExportClick("105.xlsx")} style={styles.optionButton}>Export as 105.xlsx</button>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  exportButtonContainer: { marginTop: "20px", position: "relative" },
  button: { padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" },
  exportOptionsContainer: {
    position: "absolute",
    top: "10px",
    left: "0",
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
    zIndex: 1
  },
  optionButton: {
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    cursor: "pointer"
  }
};

export default ExportButton;
