# 🚀 Express + TypeScript MVC Template

## 🧩 Core Dependencies

* **express**: `^5.1.0`
* **express-validator**: `^7.2.1`
* **express-rate-limit**: `^8.2.0`

### 🔒 Security

* **helmet**: `^8.1.0`
* **hpp**: `^0.2.3`
* **cors**: `^2.8.5`
* **bcrypt**: `^6.0.0`
* **jsonwebtoken**: `^9.0.2`
* **jsdoc**: `^4.0.4`

### 🌱 Environment & Config

* **dotenv**: `^17.2.3`
* **http-status-codes**: `^2.3.0`
* **tsconfig-paths**: `^4.2.0`

### 📚 Documentation

* **swagger-jsdoc**: `^6.2.8`
* **swagger-ui-express**: `^5.0.1`

### 🗄️ Database

* **mongoose**: `^8.19.1`

### 📊 Logging

* **morgan**: `^1.10.1`
* **pino**: `^10.0.0`
* **pino-http**: `^11.0.0`
* **pino-pretty**: `^13.1.2`

### ⚙️ Utilities & Error Handling

* **true-myth**: `^9.2.0`
* **tsyringe**: `^4.10.0`

---

## 🛠️ Development Dependencies

### 🔧 TypeScript & Tooling

* **typescript**: `^5.9.3`
* **ts-node**: `^10.9.2`
* **cross-env**: `^10.1.0`
* **rimraf**: `^6.0.1`
* **shx**: `^0.4.0`

### 🧪 Testing

* **vitest**: `^4.0.6`
* **supertest**: `^7.1.4`
* **@types/supertest**: `^6.0.3`
* **mongodb-memory-server**: `^10.3.0`
* **nock**: `^14.0.10`
* **@types/nock**: `^10.0.3`

### 🛡️ Linting & Formatting

* **eslint**: `^9.37.0`
* **prettier**: `^3.6.2`

### 📦 Type Definitions

* **@types/node**: `^24.9.2`
* **@types/express**: `^5.0.5`
* **@types/express-validator**: `^2.20.33`
* **@types/cors**: `^2.8.19`
* **@types/hpp**: `^0.2.7`
* **@types/mongoose**: `^5.11.97`
* **@types/morgan**: `^1.9.10`
* **@types/pino**: `^7.0.4`
* **@types/pino-http**: `^5.8.4`
* **@types/bcrypt**: `^6.0.0`

### 🔄 Development Utilities

* **nodemon**: `^3.1.10`

---

## 🧰 Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server with `nodemon` |
| `npm run build`        | Compile TypeScript & copy views         |
| `npm run prettier`     | Auto-format all `.ts` files             |
| `npm run formatter`    | Run `eslint` + `prettier` together      |
| `npm run test`         | Run unit tests once with `vitest`       |
| `npm run test:watch`   | Run tests in watch mode                 |
| `npm run start:local`  | Start app with PM2 (local)              |
| `npm run start:docker` | Start app inside Docker container       |

---

## 🧱 TODO / Security Enhancements

* [x] Express Rate Limit
* [ ] Mongo Rate Limit
* [x] Config Helmet
* [ ] Express Slow Down
* [ ] Prevent XSS
* [x] MIME Sniffing Protection
