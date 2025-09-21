# Event Management System (EMS)

## Project Overview
The Event Management System (EMS) is a centralized web platform designed to facilitate event creation, management, and participation for university societies and students. EMS provides role-based access for administrators, society heads, and students, ensuring efficient organization and tracking of events, while delivering personalized recommendations and notifications to students.

## Features
- **Login & Authentication**: Secure role-based access for students, society heads, and administrators.
- **User Interests**: Students select interests for personalized event recommendations.
- **Dashboard**: Displays upcoming events, recent updates, and tailored suggestions.
- **Society Pages**: Each society has a dedicated area showing events, history, members, and announcements.
- **Event Registration & Participation**: Forms for students to register and track participation.
- **Calendar Integration**: Sync events with Google/Outlook calendar; reminders included.
- **Event Search & Summary**: Search by date, type, or society; quick event details overview.
- **Feedback & QnA**: Students can provide feedback or ask questions related to events.
- **Notifications**: Push/email notifications for updates, changes, and reminders.
- **Personal Bucket List**: Track events a student has registered for.
- **Participation Records**: History of all events attended by each student.

## Tech Stack
- **Frontend**: TypeScript, React.js, Material UI
- **Backend**: TypeScript, Node.js, Express.js
- **Database**: PostgreSQL, Firestore, or MongoDB
- **Deployment**: Vercel
- **Tools/Integrations**: Firebase (notifications), Google Calendar API, GitHub (version control)

## Architecture
EMS follows a client-server architecture:
- **Frontend** communicates with the backend via REST APIs.
- **Backend** manages user profiles, events, and notifications.
- **Database** stores users, societies, events, and participation data.
- **Integrations**: Google Calendar API for syncing events and Firebase for notifications.

## Live Link
Project deployment link will be added here once available.

## License
This project is licensed under the MIT License.
