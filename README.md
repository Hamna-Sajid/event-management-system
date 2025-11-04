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
- **Frontend**: **Next.js**, TypeScript, React.js, Material UI
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

---

## Setup and Installation

Follow these steps to set up the environment and run the project locally.

### 1. Install Node.js via Chocolatey (Windows Users)

Chocolatey is recommended for managing Node.js versions.

```powershell
# Download and install Chocolatey (Run in PowerShell)
powershell -c "irm [https://community.chocolatey.org/install.ps1](https://community.chocolatey.org/install.ps1)|iex"

# Download and install Node.js (v24.11.0 is the current LTS)
choco install nodejs --version="24.11.0"

# Verify the Node.js version:
node -v 
# Verify npm version:
npm -v 
```

### 2. Install Project Dependencies

Once Node.js and npm are available, install all required packages:

```bash
npm install
```

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


### Learn More

This project is built using [Next.js](https://nextjs.org). For in-depth information, check the official resources:

  * [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
  * [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

-----

## Contributing

Contribution guidelines can be found at [CONTRIBUTING.md](CONTRIBUTING.md).y

-----

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

  * **Live Link**: Project deployment link will be added here once available.
  * **Deployment Documentation**: [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## License

This project is licensed under the MIT License.