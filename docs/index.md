---
layout: home

hero:
  name: IBA EMS
  text: Event Management System
  tagline: Centralized platform for university event creation, management, and participation
  actions:
    - theme: brand
      text: Get Started
      link: /guide/installation
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/Hamna-Sajid/event-management-system

features:
  - icon: 🔐
    title: Role-Based Access
    details: Secure authentication for students, society heads, and administrators with tailored dashboards.
  
  - icon: 📅
    title: Event Management
    details: Create, manage, and track events with calendar integration and automated reminders.
  
  - icon: 🎯
    title: Personalized Recommendations
    details: Interest-based event suggestions and notifications for students.
  
  - icon: 📊
    title: Analytics & Tracking
    details: Participation records, feedback collection, and comprehensive event statistics.
  
  - icon: 🏢
    title: Society Pages
    details: Dedicated pages for each society showing events, members, and announcements.
  
  - icon: 🔔
    title: Smart Notifications
    details: Push and email notifications for event updates, changes, and reminders.
---

## What is IBA EMS?

The Event Management System is a centralized web platform designed to facilitate event creation, management, and participation for university societies and students. EMS provides role-based access ensuring efficient organization and tracking of events.

## Key Features

### For Students
- **Personalized Dashboard**: View upcoming events and recommendations based on your interests
- **Event Registration**: Easy registration and participation tracking
- **Calendar Integration**: Sync events with Google/Outlook calendar
- **Bucket List**: Track events you want to attend
- **Feedback**: Provide feedback and ask questions about events

### For Society Heads
- **Event Creation**: Create and manage society events
- **Member Management**: Manage society members and announcements
- **Analytics**: View participation statistics and feedback

### For Administrators
- **System Management**: Oversee all events and users
- **Reporting**: Comprehensive reports on system usage
- **Society Oversight**: Manage all societies and their activities

## Quick Start

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Generate documentation:

```bash
npm run docs
```

## Documentation

- **[Installation Guide](./guide/installation)** - Set up the project locally
- **[API Reference](./api/)** - Complete API documentation for components and utilities
- **[Testing Guide](./guide/testing)** - Testing strategy and approach
- **[Documentation Standards](./guide/documentation-standards)** - Guidelines for writing documentation

## Tech Stack

- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **Backend**: TypeScript, Node.js
- **Database**: Firestore
- **Documentation**: Custom JSDoc parser, VitePress
- **Testing**: Jest, React Testing Library

## Project Structure

```
event-management-system/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions and helpers
├── docs/                   # Documentation source
└── public/                 # Static assets
```
