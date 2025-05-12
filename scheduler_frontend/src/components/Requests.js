// Requests.js
// Displays a list of course scheduling requests.
// Allows users to view current and resolved requests, and shows request details in a modal on row click.

import React, { useState } from "react";
import MiniNavBar from "./helper/MiniNavBar";

const Requests = () => {
  const [hoveredSidebarButton, setHoveredSidebarButton] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requestsData = [
    { id: 1, description: "We would like to have Professor Julius Caesar for CISC 4342-L01 on Monday 8 AM - 10AM.", department: "MSCS" },
    { id: 2, description: "Could you swap the time blocks for CISC 6344-L01 and CISC?", department: "UGDS" },
  ];

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>FORDHAM CS DEPARTMENT COURSE SCHEDULER</h2>
      </div>

      {/* Navigation Bar */}
      <div>
        <MiniNavBar />
      </div>

      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
          <button
            style={{
              ...styles.sidebarButton,
              backgroundColor: hoveredSidebarButton === "current" ? "#ADD8E6" : "#eee",
              color: hoveredSidebarButton === "current" ? "white" : "black",
            }}
            onMouseEnter={() => setHoveredSidebarButton("current")}
            onMouseLeave={() => setHoveredSidebarButton(null)}
          >
            Current Requests
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              backgroundColor: hoveredSidebarButton === "resolved" ? "#ADD8E6" : "#eee",
              color: hoveredSidebarButton === "resolved" ? "white" : "black",
            }}
            onMouseEnter={() => setHoveredSidebarButton("resolved")}
            onMouseLeave={() => setHoveredSidebarButton(null)}
          >
            Resolved Requests
          </button>
        </div>

        <div style={{ width: "100%" }}>
          <div style={styles.requestHeader}>
            <button style={styles.totalRequestsButton}>
              Total Requests: {requestsData.length}
            </button>
          </div>

          {/* Requests Table */}
          <div style={styles.requestsSection}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No.</th>
                  <th style={styles.th}>Request</th>
                  <th style={styles.th}>Department</th>
                </tr>
              </thead>
              <tbody>
                {requestsData.map((request) => (
                  <tr key={request.id} onClick={() => handleRowClick(request)}>
                    <td style={styles.td}>{request.id}</td>
                    <td style={styles.td}>{request.description}</td>
                    <td style={styles.td}>{request.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && selectedRequest && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <span style={styles.closeModal} onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
              <h3>Request Details</h3>
              <p><strong>ID:</strong> {selectedRequest.id}</p>
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Department:</strong> {selectedRequest.department}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "Arial, sans-serif", width: "100%", textAlign: "center" },
  header: { padding: "10px", fontSize: "20px", fontWeight: "bold" },
  mainContent: { display: "flex", marginTop: "20px" },
  sidebar: { width: "372px", display: "flex", flexDirection: "column", padding: "10px" },
  sidebarButton: { margin: "10px 0", padding: "10px", background: "#eee", border: "1px solid #ccc", cursor: "pointer" },
  requestHeader: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align left
    width: "100%",
  },
  totalRequestsButton: {
    padding: "8px 15px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "120px",
  },
  requestsSection: { width: "80%", padding: "10px", display: "flex", justifyContent: "center", margin: "0 auto", marginTop: "0" },
  table: { width: "100%", maxWidth: "1050px", margin: "0 auto", borderCollapse: "collapse", border: "1px solid black", marginBottom: "20px" },
  th: { padding: "10px", background: "#333", color: "white", border: "none" },
  td: { padding: "10px", border: "none" },
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "300px", maxWidth: "500px", textAlign: "left" },
  closeModal: { position: "absolute", top: "10px", right: "10px", fontSize: "20px", cursor: "pointer" }
};

export default Requests;
