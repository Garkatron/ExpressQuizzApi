import { config } from 'dotenv'
config({ path: '.env.test' })

import request from "supertest";
import app from "../src/main";

export let token: string;
export let userId: string;

const testUser = {
  name: "testuser_global",
  email: "test_global@test.com",
  password: "testingPassword123",
};

export async function globalSetup() {
  const register = await request(app).post("/api/v1/users/register").send(testUser);
  userId = register.body.data._id;

  const login = await request(app)
    .post("/api/v1/users/login")
    .send({ name: testUser.name, password: testUser.password });
  token = login.body.data.accessToken;
}

export async function globalTeardown() {
  await request(app)
    .delete(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
}
