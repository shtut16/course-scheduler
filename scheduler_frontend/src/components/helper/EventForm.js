// EventForm.js
// A form component for creating a new course event, including fields for title, instructor,
// days, times, and description.

import React, { useState } from 'react';

const daysOptions = [
  { label: 'Sunday', value: 'U' },
  { label: 'Monday', value: 'M' },
  { label: 'Tuesday', value: 'T' },
  { label: 'Wednesday', value: 'W' },
  { label: 'Thursday', value: 'R' },
  { label: 'Friday', value: 'F' },
  { label: 'Saturday', value: 'S' },
];

const timeOptions = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00'
];

const EventForm = ({ onCreateEvent, onClose }) => {
  const [formData, setFormData] = useState({
    course_number: '',
    course_title: '',
    instructor: '',
    days: [],
    startTime: '',
    endTime: '',
    course_description: '',
  });

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      days: checked
        ? [...prev.days, value]
        : prev.days.filter(d => d !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.startTime >= formData.endTime) {
      setError('Start time must be earlier than end time.');
      return;
    }

    setError('');

    if (onCreateEvent) {
      const times = `${formData.startTime}-${formData.endTime}`;
      const eventData = {
        ...formData,
        days: formData.days.join(''),
        times,
      };
      onCreateEvent(eventData);
      setFormData({
        course_number: '',
        course_title: '',
        instructor: '',
        days: [],
        startTime: '',
        endTime: '',
        course_description: '',
      });
      if (onClose) onClose();  // Close form after submission
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    if (onClose) onClose();
  };

  if (!isFormVisible) return null;

  return (
    <div className="event-form">
      <button className="close-button" onClick={handleClose} aria-label="Close Form">
        &times;
      </button>
      <h2>Create New Course</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="course_number">Course Number</label>
          <input
            id="course_number"
            name="course_number"
            value={formData.course_number}
            onChange={handleChange}
            required
            aria-describedby="course_number_help"
          />
          <small id="course_number_help">Enter the course number.</small>
        </div>

        <div className="form-group">
          <label htmlFor="course_title">Course Title</label>
          <input
            id="course_title"
            name="course_title"
            value={formData.course_title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructor">Instructor</label>
          <input
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Days</label>
          <div className="checkbox-group">
            {daysOptions.map(day => (
              <label key={day.value}>
                <input
                  type="checkbox"
                  value={day.value}
                  checked={formData.days.includes(day.value)}
                  onChange={handleDayChange}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <select
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Start Time --</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <select
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          >
            <option value="">-- Select End Time --</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="course_description">Course Description</label>
          <textarea
            id="course_description"
            name="course_description"
            value={formData.course_description}
            onChange={handleChange}
            rows="4"
            aria-describedby="course_description_help"
          />
          <small id="course_description_help">Provide a brief description of the course.</small>
        </div>

        <button type="submit" className="submit-button">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
