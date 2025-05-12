import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Use the default Axios import

const RecentChanges = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // Limit to 5 initially

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Retrieve the JWT token from localStorage

    if (!token) {
      console.error('No access token found');
      setLoading(false);
      setError('No access token found');
      return;
    }

    axios.get('http://localhost:8000/api/recent-changes/', {
      headers: {
        Authorization: `Bearer ${token}`, // Add token in the Authorization header
      },
    })
      .then(response => {
        setChanges(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recent changes:', error);
        setLoading(false);
        setError('Failed to fetch recent changes. Please check your connection or try again later.');
      });
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 5); // Show 5 more entries each time
  };

  if (loading) return <p className="loading-message">Loading recent changes...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="recent-changes-container">
      <h2>Recent Changes</h2>

      {changes.length === 0 ? (
        <p>No recent changes.</p>
      ) : (
        <div>
          <table className="recent-changes-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Event</th>
                <th>Timestamp</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {changes.slice(0, visibleCount).map((log, index) => (
                <tr key={index}>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.event_title}</td>
                  <td className="timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="notes">{log.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCount < changes.length && (
            <button className="show-more-btn" onClick={handleShowMore}>Show More</button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentChanges;
