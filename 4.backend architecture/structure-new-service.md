# Structuring a New Service

## Overview
To structure a new service, consider:
- Separation of concerns
- Maintainability
- Scalability

## Layered Architecture
Separate different concerns of the application into different layers.

### Layers

#### Presentation/Controllers Layer
- Handles HTTP requests and responses
- Entry point for API requests

#### Service Layer
- Contains business logic
- Processes data and applies rules

#### Repository Layer
- Handles database interactions
- Abstracts data access

### Benefits
- **Organization** – Each layer has specific responsibility
- **Maintainability** – Easier to find and modify code
- **Scalability** – Can scale each layer independently
- **Testability** – Easier to write unit tests for isolated layers

## Using Express Framework
Express helps structure Node.js applications with middleware and routing patterns.

## Design Patterns

### Repository Pattern
Abstract the data access layer to:
- Make it easier to switch between databases
- Switch between different data sources
- Improve testability

## Project Structure

```
src/
├── controllers/      # Handles HTTP requests and responses
├── services/         # Contains business logic
├── repositories/     # Handles database interactions
├── models/           # Defines data models and schemas
├── routes/           # Defines API routes
└── index.ts          # Entry point of the application
```

## Directory Descriptions

### controllers/
- Receive HTTP requests
- Call appropriate services
- Return responses to clients

### services/
- Implement business logic
- Process data
- Apply business rules
- Call repositories for data access

### repositories/
- Query database
- Save data to database
- Abstract database operations

### models/
- Define TypeScript interfaces/types
- Define database schemas
- Ensure type safety

### routes/
- Define API endpoints
- Map endpoints to controllers

### index.ts
- Configure server
- Set up middleware
- Start application

## Benefits
- **Clear separation of concerns** – Each layer has specific responsibility
- **Reusable components** – Services can be used by multiple routes
- **Easy to test** – Can mock dependencies for unit testing
- **Flexible** – Easy to modify layers without affecting others
