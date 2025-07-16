# NestJS TypeORM PostgreSQL Boilerplate

This repository is a boilerplate setup for building scalable backend applications using [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and [PostgreSQL](https://www.postgresql.org/). It includes everything you need to start developing a robust RESTful API or microservice, with best practices for code formatting, testing, migrations, and environment configuration.

## Features

- **NestJS**: Modular architecture for building scalable server-side applications.
- **TypeORM**: Powerful ORM for TypeScript & JavaScript (ES7, ES6, ES5).
- **PostgreSQL**: Relational database integration.
- **Prettier & ESLint**: Automated code formatting and linting.
- **Jest**: Ready-to-use unit and e2e testing.
- **TypeORM Migrations**: Built-in CLI commands for managing database schema changes.
- **Environment Configuration**: Easily manage config for different environments.
- **Scripted ORM Config**: Dynamic `ormconfig.json` generation.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL database

### Installation

```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
```

### Environment Setup

Copy the `.env.example` to `.env` and update your database credentials:

```bash
cp .env.example .env
```

Fill in your PostgreSQL connection details in `.env`.

### Database Setup

Create your development database in PostgreSQL.

### Running the App

#### Development

```bash
npm run start:dev
```

#### Production Build & Start

```bash
npm run build
npm run start:prod
```

#### Debug Mode

```bash
npm run start:debug
```

### Code Quality

```bash
npm run format      # Format code using Prettier
npm run lint        # Lint and auto-fix code using ESLint
```

### Testing

- **All tests:**  
  `npm test`
- **Test with watch:**  
  `npm run test:watch`
- **Test coverage:**  
  `npm run test:cov`
- **Debug tests:**  
  `npm run test:debug`
- **End-to-end tests:**  
  `npm run test:e2e`

### TypeORM Migrations

Before running migration commands, generate the ORM config:

```bash
npm run pretypeorm
```

#### Generate Migration

```bash
npm run typeorm:migration:generate --name=MigrationName
```

#### Run Migrations

```bash
npm run typeorm:migration:run
```

## Project Structure

```
src/
  main.ts          # Entry point
  app.module.ts    # Root module
  database/        # Database entities and migrations
  config/          # Environment and data source configs
  scripts/         # Utility scripts (e.g., write-type-orm-config.ts)
test/              # Test files
```

## Scripts Summary

| Script                       | Description                                       |
|------------------------------|---------------------------------------------------|
| `start:dev`                  | Start app in development mode (hot reload)        |
| `start:debug`                | Start app in debug mode                           |
| `start:prod`                 | Start app in production mode                      |
| `build`                      | Compile TypeScript to JavaScript                  |
| `format`                     | Format code using Prettier                        |
| `lint`                       | Run ESLint and auto-fix issues                    |
| `test` / `test:watch`        | Run unit tests / watch mode                       |
| `test:cov`                   | Test coverage report                              |
| `test:e2e`                   | Run end-to-end tests                              |
| `pretypeorm`                 | Generate dynamic ormconfig.json                   |
| `typeorm`                    | TypeORM CLI (with ts-node & config loader)        |
| `typeorm:migration:generate` | Generate a new migration file                     |
| `typeorm:migration:run`      | Apply migrations to the database                  |

## License

This project is licensed under the MIT License.

---

Feel free to fork and customize for your own needs!
