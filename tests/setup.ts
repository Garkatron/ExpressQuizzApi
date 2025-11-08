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
 
  

  if (register.status === 201) {
    userId = register.body.data._id || register.body.data.user?._id;
    console.log("Created user:", userId);
  } else if (register.status === 400 || register.status === 409) {
    console.log("User already exists, login...");
  } else {
    console.warn("Register returned unexpected:", register.status, register.body);
  }

  
  const login = await request(app)
    .post("/api/v1/users/login")
    .send({ name: testUser.name, password: testUser.password });
  token = login.body.data.accessToken;
  userId = login.body.data.user?.id;
}

export async function globalTeardown() {
  await request(app)
    .delete(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
}
