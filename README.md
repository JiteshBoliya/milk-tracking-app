# Milk Tracking App

A web application for milk vendors to track their clients and daily milk deliveries.

## Features

- Client Management
  - Add and manage clients
  - Track client details (name, address, contact, milk type, quantity per day)
  - Set custom rates per liter for each client

- Delivery Tracking
  - Record daily milk deliveries
  - Add notes for each delivery
  - View delivery history by client
  - Filter deliveries by date range

- Reports
  - Calculate monthly totals
  - View delivery history in table format
  - Filter and search capabilities

## Tech Stack

- Angular 19
- Angular Material
- Firebase (Firestore)
- TypeScript
- SCSS

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable Firestore

4. Update the Firebase configuration in `src/app/app.config.ts` with your Firebase project details:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. Start the development server:
   ```bash
   ng serve
   ```

6. Navigate to `http://localhost:4200` in your browser

## Development

- Run `ng serve` for a dev server
- Run `ng build` to build the project
- Run `ng test` to execute unit tests

## Security

The current Firestore rules allow read/write access to all documents. In a production environment, you should:

1. Implement proper authentication
2. Update the Firestore rules to restrict access based on user roles
3. Add data validation rules
4. Implement proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
