# Next.js Service Broker Client

This is a Next.js application that demonstrates integration with a Service Broker pattern, combining user management and file processing capabilities.

## Features

- **User Management**: Create and retrieve users via service broker API
- **File Processing**: Upload files for processing through the service broker
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Service Broker Integration**: Consistent API patterns with other clients in this repository

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Update the service broker URLs if different from defaults.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Service Broker Integration

This application expects a Spring Boot Service Broker API running on `http://localhost:8080` with the following endpoints:

- `/api/broker/submitRequest` - Standard service broker requests
- `/api/broker/submitRequestWithFile` - File upload requests

### Supported Services

**User Service (`userService`):**
- `getById` - Retrieve user by ID
- `create` - Create new user

**File Service (`fileService`):**
- `processDocument` - Process uploaded files

## Architecture

The application follows the established service broker pattern:

- **Service Layer**: `src/services/brokerClient.ts` - API communication
- **Components**: `src/components/service-broker-client.tsx` - Main UI
- **API Routes**: `src/app/api/broker/` - Next.js API proxies
- **Types**: Consistent interfaces across all client implementations

## Available Scripts

- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
