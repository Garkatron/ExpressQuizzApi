import request from "supertest"
import { describe, it, expect, afterAll } from "vitest"
import app from "../src/main"
import { disconnectDB } from "../src/databases/mongoose"

describe("GET /", () => {
  it("Should respond with 200", async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(200)
  })
})

const test_password = "testingPassword2";
const test_username = "testuser2";
const test_email = "test2@test.com";

let test_id: string | null = null;

describe("POST /api/v1/users/register", () => {
  it("Should create an user and send 201", async () => {
    const body = {
      name: test_username,
      email: test_email,
      password: test_password
    }

    const res = await request(app)
      .post("/api/v1/users/register")
      .send(body)
      .set("Accept", "application/json")

    if (res.status !== 201) {
      console.log("Error response:", res.body)
    }

    test_id = res.body.data._id;    

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("data")
    expect(res.body.data).toHaveProperty("email", test_email)
  })
})

// ? login
let token: string | null = null;   

describe("POST /api/v1/users/login", () => {
  it("Should login the test user and send 200", async () => {
    const body = {
      name: test_username,
      password: test_password
    }

    const res = await request(app)
      .post("/api/v1/users/login")
      .send(body)
      .set("Accept", "application/json")

    if (res.status !== 200) {
      console.log("Error response:", res.body)
    }

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("data.accessToken")
    expect(typeof res.body.data.accessToken).toBe("string")
    expect(res.body.data.user).toHaveProperty("email", test_email)

    token = res.body.data.accessToken;
  })
})

describe("DELETE /api/v1/users/:id", () => {
  it("Should delete the test user and respond 200", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${test_id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)

    if (res.status !== 200) {
      console.log("Error response:", res.body)
    }
    
    expect(res.status).toBe(200)    
    expect(res.body.data).toHaveProperty("_id", test_id as string)
  })
})


afterAll(async () => {
  await disconnectDB()
})
