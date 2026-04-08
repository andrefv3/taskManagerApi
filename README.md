<h1 align="center">Task Manager — Backend</h1>
<p align="center">
  A scalable and production-ready Task Management API built with modern backend technologies and best practices.
</p>

<p align="center"> 
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs" /> 
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" /> 
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma" /> 
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql" /> 
</p>

---

## 📌 Architectural Highlight: Dual-Connection Pattern

One of the core engineering challenges solved in this project was the **Supabase + PgBouncer connectivity** orchestration. 

Unlike standard implementations, this backend implements a **Dual-Connection Strategy**:
- **Application Layer (Runtime):** Utilizes `@prisma/adapter-pg` with a **Transaction-mode Pooler** (port 6543) via `DATABASE_URL`. This allows the application to scale to thousands of concurrent users without exhausting database connections.
- **Migration Layer (CLI):** Implements a **Direct Connection** (port 5432) via `DIRECT_URL` and `@prisma/config`. This bypasses PgBouncer limitations, allowing complex DDL operations and schema migrations that require prepared statements.

---

## 🧠 Engineering Excellence

- **Modular Architecture:** Organized into domain-driven modules (Auth, Users, Tasks) for high maintainability and separation of concerns.
- **Advanced Security:** - JWT-based stateless authentication with Passport strategies.
  - Salted password hashing using **Bcrypt**.
  - Protected routes via Auth Guards.
- **Data Integrity:** - Strict DTO enforcement with `class-validator` and `class-transformer`.
  - Prisma as a **Single Source of Truth** for database schema and TypeScript types.
- **Performance:** Optimized SQL queries and connection management via transaction pooling to minimize latency and resource overhead.

---

## 🚀 Key Features

- **Auth System:** Secure Login/Register with dynamic user profiles and password encryption.
- **Task Lifecycle:** Advanced CRUD operations with status-based filtering (Pending, In-Progress, Completed).
- **Ownership Logic:** Native multi-tenancy support where users can only access and manage their own resources (Secure Scoping).
- **Error Handling:** Global Exception Filters providing consistent and informative API responses.

---

## 🛠 Tech Stack & Tools

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript 5
- **ORM:** Prisma 7
- **Database:** PostgreSQL (Supabase)
- **Deployment:** Render (CI/CD integrated)

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v25+)
- PostgreSQL or Supabase account

### Installation

```bash
$ npm install
$ npx prisma generate
$ npm build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## 🌍 API Documentation (Summary)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Create a new account | No |
| **POST** | `/auth/login` | Obtain JWT token | No |
| **GET** | `/tasks` | List user tasks | Yes |
| **POST** | `/tasks` | Create a new task | Yes |
| **PATCH** | `/tasks/:id` | Update status | Yes |
| **DELETE** | `/tasks/:id` | Delete task | Yes |

## 📈 Engineering Purpose

This project serves as a showcase of modern backend patterns: Infrastructure as Code, Type-Safe ORMs, and Scalable Connection Management. It demonstrates the ability to move beyond simple CRUDs into professional-level systems architecture, ready for cloud-native deployment.
