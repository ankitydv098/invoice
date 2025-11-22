# Invoice Management Platform

A full-featured invoice management application built with Next.js 16, TypeScript, and Prisma ORM.

## Features

- **Client Management**: Add, edit, and manage clients
- **Invoice Creation**: Create professional invoices with due dates and descriptions
- **PDF Generation**: Export invoices as PDF documents
- **Currency Support**: Multi-currency support (INR, USD, EUR, GBP)
- **User Authentication**: Secure login and signup system
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom authentication system with bcrypt
- **PDF Generation**: jsPDF

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ankitydv098/invoice.git
   cd invoice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Available Scripts

- `npm run dev` - Starts the development server on port 3001
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs the linter

## Deployment

The application can be deployed to any Node.js hosting platform. For production deployment:

1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
