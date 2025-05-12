# Fordham CS Department Course Scheduler

This is a full-stack web application built using **React** for the frontend 
and **Django** for the backend. It allows users to create, share, and manage calendar events 
collaboratively with features like user authentication, an admin dashboard, and conflict resolution (work in progress).

## Current Features

-  **User Authentication** — Sign up, log in, and access protected pages.
-  **Personal Calendar** — Manage your own calendar and events.
-  **Shared Calendar** — View and collaborate on a shared team calendar.
-  **Admin Dashboard** — Admins can view all users and recent activity.
-  **Recent Changes Log** — Tracks user actions (add/edit/delete events).
-  **Export Calendar** — Download your calendar as a PDF.

## Features In Progress

- ️ **Conflict Detection** — Identify conflicting events between users.
-  **Request System** — Request changes or push personal events to the shared calendar.
-  **Export Calendar** — Download your calendar as an Excel/CSV file.

## Technologies Used

### Frontend
- React
- React Router
- Axios
- FullCalendar
- html2canvas + jsPDF (for PDF export)

### Backend
- Django + Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- PostgreSQL or SQLite (configurable)

## Getting Started

### 1. Download the Project

- Download and extract the `lwin-course-scheduler.zip` file containing the project source code.
- The extracted folder will contain two main directories: `scheduler_backend` and `scheduler_frontend`.

### 2. Backend Setup

1. Open a terminal and navigate to the `scheduler_backend` directory:
   ```bash
   cd path/to/your/extracted/folder/scheduler_backend
   
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate
   
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt

4. Run database migrations:
   ```bash
   python manage.py migrate

5. Create a superuser (admin account):
   ```bash
   python manage.py createsuperuser
   
6. Start the backend server:
   ```bash
   python manage.py runserver
   
### 3. Frontend Setup
1. Open a new terminal and navigate to the `scheduler_frontend` directory:
   ```bash
   cd path/to/your/extracted/folder/scheduler_frontend
   
2. Install Node.js dependencies:
   ```bash
   npm install
   
3. Start the frontend development server:
   ```bash
   npm start
   
### 4. Environment Variables
Ensure the .env file in the `scheduler_frontend` directory has the following:
```bash
REACT_APP_API_URL=http://localhost:8000
```
If not, create one.

In the `scheduler_backend` (settings.py), make sure CORS settings allow your frontend origin (http://localhost:3000).

### 5. Run Webapp
While the backend and frontend is running, you can visit http://localhost:3000/ to use the Course Scheduler.

### Notes
1. Make sure Python, Node.js, Django are installed on your system.

2. These instructions are for the project to be run locally.

3. The admin dashboard is accessible only to users with staff or superuser status.

4. If you do not want to create a new superuser, use the existing credentials:
<br>
username: admin
<br>
password: test

## Author
- **Shein Htut Tun Lwin**



   


   




   


   

