import request from "supertest";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import app from "../src/main";
import { disconnectDB } from "../src/databases/mongoose";
import { globalSetup, globalTeardown, token } from "./setup";
import { ERROR_MESSAGES } from "#constants";

beforeAll(async () => await globalSetup());
afterAll(async () => {
  await globalTeardown();
  await disconnectDB();
});

let collection_id: string = "";

describe("POST /api/v1/collections", () => {
  it("Should create a collection and send 201", async () => {
    const body = {
      name: "Test Collection",
      tags: ["math", "science"],
      questions: []
    };

    const res = await request(app)
      .post("/api/v1/collections")
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    if (res.status !== 201) {
      console.log("Error response:", res.body);
    }

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("name", body.name);
    expect(res.body.data.tags).toEqual(expect.arrayContaining(body.tags));
    expect(res.body.data).toHaveProperty("_id");

    collection_id = res.body.data._id;
  });

  it("Should fail if collection already exists", async () => {
    const body = {
      name: "Test Collection",
      tags: [],
      questions: []
    };

    const res = await request(app)
      .post("/api/v1/collections")
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain(ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS);
  });
});

describe("GET /api/v1/collections", () => {
  it("Should get all collections and send 200", async () => {
    const res = await request(app)
      .get("/api/v1/collections")
      .set("Accept", "application/json");

    if (res.status !== 200) {
      console.log("Error response:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/v1/collections?id=<collection_id>", () => {
  it("Should get a collection by id", async () => {
    const res = await request(app)
      .get("/api/v1/collections")
      .query({ id: collection_id })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toHaveProperty("_id", collection_id);
  });
});

describe("DELETE /api/v1/collections/:id", () => {
  it("Should delete a collection and send 200", async () => {
    const res = await request(app)
      .delete(`/api/v1/collections/${collection_id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    if (res.status !== 200) {
      console.log("Error response:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("Should fail deleting non-existing collection", async () => {
    const res = await request(app)
      .delete(`/api/v1/collections/${collection_id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain(ERROR_MESSAGES.COLLECTION_NOT_FOUND);
  });
});
