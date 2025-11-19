# Installation

## Prerequisites

- Node.js v24.11.0 or higher
- npm or yarn package manager
- Git

## Step 1: Install Node.js

### Windows (using Chocolatey)

```powershell
# Install Chocolatey
powershell -c "irm https://community.chocolatey.org/install.ps1 | iex"

# Install Node.js
choco install nodejs --version="24.11.0"

# Verify installation
node -v
npm -v
```

## Step 2: Clone the Repository

```bash
git clone https://github.com/Hamna-Sajid/event-management-system.git
cd event-management-system
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Documentation
npm run docs            # Generate API documentation
npm run docs:dev        # Start VitePress dev server

# Code Quality
npm run lint            # Run ESLint
```

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run dev
```

### Firebase Connection Issues

Ensure your Firebase credentials are correctly set in the `.env` file and that your Firebase project has the necessary services enabled (Authentication, Firestore).

### Build Errors

Clear the cache and reinstall dependencies:

```bash
rm -rf node_modules .next
npm install
npm run build
```
