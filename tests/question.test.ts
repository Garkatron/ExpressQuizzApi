import request from "supertest"
import { describe, it, expect, afterAll, beforeAll } from "vitest"
import app from "../src/main"
import { disconnectDB } from "../src/databases/mongoose"
import { globalSetup, globalTeardown, token } from "./setup";
import { ERROR_MESSAGES } from "#constants";

beforeAll(async () => await globalSetup());
afterAll(async () => {
  await globalTeardown();
  await disconnectDB();
});

let question_id: string = "";

describe("POST /api/v1/questions", () => {
  it("Should create a question and send 201", async () => {
    const body = {
      question_text: "test question",
      options: ["a", "b", "c"],
      answer: "a",
      tags: []
    }

    const res = await request(app)
      .post("/api/v1/questions")
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)

    if (res.status !== 201) {
      console.log("Error response:", res.body)
    }

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question", body.question_text)
    expect(res.body.data).toHaveProperty("owner")
    expect(res.body.data.options).toContain("a")
    expect(res.body.data).toHaveProperty("_id");

    question_id = res.body.data._id;
  })
})

describe("GET /api/v1/questions", () => {
  it("Should get all the questions and send 200", async () => {

    const res = await request(app)
      .get(`/api/v1/questions`)
      .set("Accept", "application/json")

    if (res.status !== 200) {
      console.log("Error response:", res.body)
    }

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

  })
})


describe("GET /api/v1/questions?id=<question_id>", () => {
  it("Should get the question by id with pagination params", async () => {
    const res = await request(app)
      .get(`/api/v1/questions`)
      .query({ id: question_id, page: 1, limit: 10 })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toHaveProperty("_id", question_id);
  });
});

describe("PATCH /api/v1/questions/:id", () => {
  it("Should edit a question's text and return 200", async () => {
    const body = {
      field: "question",
      value: "Updated question text"
    };

    const res = await request(app)
      .patch(`/api/v1/questions/${question_id}`)
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    if (res.status !== 200) {
      console.log("Error response:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", question_id);
    expect(res.body.data).toHaveProperty("question", body.value);
  });

  it("Should edit a question's options and return 200", async () => {
    const body = {
      field: "options",
      value: ["x", "y", "z"]
    };

    const res = await request(app)
      .patch(`/api/v1/questions/${question_id}`)
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.options).toEqual(expect.arrayContaining(body.value));
  });

  it("Should fail if editing answer not in options", async () => {
    const body = {
      field: "answer",
      value: "invalid_answer"
    };

    const res = await request(app)
      .patch(`/api/v1/questions/${question_id}`)
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400); 
    expect(res.body.success).toBe(false);
  });

  it("Should fail if field is not editable", async () => {
    const body = {
      field: "tags",
      value: ["tag1"]
    };

    const res = await request(app)
      .patch(`/api/v1/questions/${question_id}`)
      .send(body)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain(ERROR_MESSAGES.FIELD_NOT_EDITABLE);
  });
});



describe("DELETE /api/v1/questions/:id", () => {
  it("Should delete a question and send 200", async () => {

    const res = await request(app)
      .delete(`/api/v1/questions/${question_id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)

    if (res.status !== 200) {
      console.log("Error response:", res.body)
    }

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

  })
})


