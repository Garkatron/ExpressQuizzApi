import request from "supertest"
import { describe, it, expect, afterAll, beforeAll } from "vitest"
import app from "../src/main"
import { disconnectDB } from "../src/databases/mongoose"
import test from "node:test"
import { globalSetup, globalTeardown, token } from "./setup";

beforeAll(async () => await globalSetup());
afterAll(async () => await globalTeardown());



afterAll(async () => {
  await disconnectDB()
})
