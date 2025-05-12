import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./helper/axiosInstance"; // replace the import
import MiniNavBar from "./helper/MiniNavBar";

const Conflicts = () => {
  const [hoveredSidebarButton, setHoveredSidebarButton] = useState(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [conflictsData, setConflictsData] = useState([]);
  const [etData, setEtData] = useState([]);
  const [caData, setCaData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const [conflictsRes, etRes, caRes] = await Promise.all([
          axios.get("/api/conflicts"), // Adjust API endpoint
          axios.get("/api/exceeded-time-blocks"), // Adjust API endpoint
          axios.get("/api/course-amount-conflicts") // Adjust API endpoint
        ]);
        setConflictsData(conflictsRes.data);
        setEtData(etRes.data);
        setCaData(caRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleConflictRowClick = (conflict) => {
    setSelectedConflict(conflict);
    setIsConflictModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  // if (error) {
    // return <div>{error}</div>; // Show error message
  // }

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
        <div style={styles.sidebar}>
          <button
            style={{
              ...styles.sidebarButton,
              backgroundColor: hoveredSidebarButton === "create" ? "#ADD8E6" : "#eee", // Hover effect for "Create New Calendar"
              color: hoveredSidebarButton === "create" ? "white" : "black",
            }}
            onMouseEnter={() => setHoveredSidebarButton("create")}
            onMouseLeave={() => setHoveredSidebarButton(null)}
          >
            Current Conflicts
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              backgroundColor: hoveredSidebarButton === "import" ? "#ADD8E6" : "#eee", // Hover effect for "Import"
              color: hoveredSidebarButton === "import" ? "white" : "black",
            }}
            onMouseEnter={() => setHoveredSidebarButton("import")}
            onMouseLeave={() => setHoveredSidebarButton(null)}
          >
            Resolved Conflicts
          </button>
        </div>
        <div style={{ width: "100%" }}>
          <div style={styles.conflictHeader}>
            <button style={styles.totalConflictsButton}>
              Total Conflicts: {conflictsData.length}
            </button>
          </div>


          {error && (
              <div style={{color: "red", marginBottom: "20px"}}>
                {error}
              </div>
          )}

          {/* Conflict Tables */}
          <div style={styles.conflictsSection}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Time Conflicts</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {conflictsData.map((conflict) => (
                  <tr key={conflict.id} onClick={() => handleConflictRowClick(conflict)}>
                    <td style={styles.td}></td>
                    <td style={styles.td}>{conflict.description}</td>
                    <td style={styles.td}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.conflictsSection}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Exceeded Time Blocks Conflicts</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {etData.map((etconflict) => (
                  <tr key={etconflict.id} onClick={() => handleConflictRowClick(etconflict)}>
                    <td style={styles.td}></td>
                    <td style={styles.td}>{etconflict.description}</td>
                    <td style={styles.td}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.conflictsSection}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}></th>
                  <th style={styles.th}>Course Amount Conflicts</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {caData.map((caconflict) => (
                  <tr key={caconflict.id} onClick={() => handleConflictRowClick(caconflict)}>
                    <td style={styles.td}></td>
                    <td style={styles.td}>{caconflict.description}</td>
                    <td style={styles.td}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isConflictModalOpen && selectedConflict && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <span style={styles.closeModal} onClick={() => setIsConflictModalOpen(false)}>
                &times;
              </span>
              <h3>Conflict Details</h3>
              <p><strong>ID:</strong> {selectedConflict.id}</p>
              <p><strong>Description:</strong> {selectedConflict.description}</p>
              <p><strong>Department:</strong> {selectedConflict.department}</p>
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
  conflictHeader: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align left
    width: "100%",
  },
  totalConflictsButton: {
    padding: "8px 15px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "120px",
  },
  conflictsSection: {
    width: "80%",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    marginTop: "0"
  },
  table: { width: "100%", maxWidth: "1050px", margin: "0 auto", borderCollapse: "collapse", border: "1px solid black", marginBottom: "20px" },
  th: { padding: "10px", background: "#333", color: "white", border: "none" },
  td: { padding: "10px", border: "none" },
  tr: { borderBottom: "1px solid black" },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
    maxWidth: "500px",
    textAlign: "left",
  },
  closeModal: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "20px",
    cursor: "pointer",
  }
};


export default Conflicts;
