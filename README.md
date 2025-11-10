![logo](image/README/1762774805670.png)

# 🧠 Express Quizz API

> RESTful API built with **TypeScript**, **Express**, and **Mongoose**, following a clean MVC architecture.  
> Includes authentication, authorization, and integration testing using **Vitest** and **Supertest**.

---

## 🚀 Key Features

- 🧩 **Question Management** – Create, edit, delete, and retrieve questions.  
- 📚 **Collections System** – Group questions into collections.  
- 👤 **User Authentication** – Register, login, and manage users securely.  
- 🔐 **JWT Tokens** – Stateless authentication for users.  
- 🛡️ **Role-Based Permissions** – Admin and standard user access control.  
- 🧪 **Integration Testing** – Powered by **Vitest**, **Supertest**, and **mongodb-memory-server**.  
- ⚙️ **Clean Architecture (MVC + OOP)** – Modular and scalable project structure.  
- 📖 **API Documentation** – Auto-generated using **Swagger UI**.  
- 🪵 **Structured Logging** – Using **Pino** and **Morgan** for detailed request logs.  
- 🧰 **Validation & Security** – Helmet, Rate Limiting, HPP, Express Validator, and CORS.

---

## 🧩 Main Technologies

| Category | Libraries |
|-----------|------------|
| Framework | [Express 5](https://expressjs.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [Mongoose](https://mongoosejs.com/) |
| Auth | [JWT](https://www.npmjs.com/package/jsonwebtoken), [bcrypt](https://www.npmjs.com/package/bcrypt) |
| Security | Helmet, CORS, Rate Limiter, HPP |
| Logging | Pino, Morgan |
| Testing | Vitest, Supertest, MongoDB Memory Server |
| Docs | Swagger JSDoc + Swagger UI |
| DI | [tsyringe](https://github.com/microsoft/tsyringe) |

---

## 📂 Project Structure

src/
├── main.ts         🏛️
├── configs/        📄
├── controllers/    🎮
├── databases/      🗃️
│ └── mongoose.ts   🧺
├── dtos/
├── interfaces/
├── middlewares/    ⚔️
├── models/         🏘️
├── routes/         🛣️
├── utils/          🛠️
├── constants.ts
├── .env.test       🧪
├── .env.production 🚀
├── .env.example
└── .env            🏗️

# 🧱 Architecture Overview

- **Controllers** → Handle HTTP requests/responses.

- **Services** / Modules → Business logic, injected via tsyringe.

- **Models** → Mongoose schemas.

- **DTOs & Interfaces** → Define TypeScript types and contracts.

- **Middlewares** → Validation, Auth, Logging, Error handling.

- **Utils** → **Helpers** (e.g., token generation, formatting).

_Follows Clean Architecture principles with OOP and dependency injection._

# Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Run development server with live reload |
| `npm run build`      | Compile TypeScript to `dist`            |
| `npm start`          | Run compiled production server          |
| `npm test`           | Run integration tests                   |
| `npm run test:watch` | Run tests in watch mode                 |
| `npm run prettier`   | Format codebase                         |
| `npm run clean`      | Remove compiled files (`dist/`)         |

# 🧪 Testing
* Run tests once
  * `npm run test`
* Run tests in watch mode
  * `npm run test`:watch


# 📖 API Documentation
> Swagger UI is available at:
> http://localhost:4000/api/docs

Automatically generated from JSDoc annotations using:

* swagger-jsdoc

* swagger-ui-express


# 🔐 Authentication Flow

1. User registers (/api/v1/auth/register)

2. User logs in and receives JWT token

3. Token must be included in headers:
   * Authorization: Bearer <token>

4. Middleware verifies token and applies role-based access (e.g. EDIT_COLLECTION, DELETE_QUESTION)

# 📜 Licence
MIT © 2025 @Garkatron