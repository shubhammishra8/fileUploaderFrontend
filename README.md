# File Upload Frontend

This is the frontend application for the file upload system, built with Next.js and React. It provides a modern, responsive interface for uploading and managing files.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Mode

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Features

- Modern, responsive UI
- Drag and drop file upload
- File list with details
- Progress indicators for uploads
- File deletion capability
- Error handling and notifications



## Technologies Used

- Next.js 15
- React 19
- Styled Components
- Axios for API calls
- ESLint for code quality

## Development

The application uses:

- Turbopack for faster development builds
- ESLint for code linting
- Next.js App Router for routing
- Styled Components for styling

## Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
