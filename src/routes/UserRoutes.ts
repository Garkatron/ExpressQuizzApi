import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middlewares/auth.js";
import { UserPermissions } from "../constants.js"

import { deleteUser, editUser, getUsers, loginUser, registerUser } from "../controllers/UserController.js";
import { body, param, query } from "express-validator";
import { handle_validation_errors } from '../middlewares/sanitization.js';

const router = express.Router();


/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "64a8c123f1e6c2a1b2c56789"
 *               name: "John Doe"
 *               email: "john@example.com"
 */
router.post("/register", body("name").trim().escape(), body("email").trim().escape().normalizeEmail(), body("password").trim(), handle_validation_errors, registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: "64a8c123f1e6c2a1b2c56789"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 permissions:
 *                   ADMIN: false
 *                   CREATE_QUESTION: true
 *                   EDIT_QUESTION: true
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post("/login", body("name").trim().escape(), body("password").trim(), handle_validation_errors, loginUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "64a8c123f1e6c2a1b2c56789"
 */
router.delete("/:id", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]),
    param("id").trim().escape(), handle_validation_errors, deleteUser);


/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Edit a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *               newEmail:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User edited successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "64a8c123f1e6c2a1b2c56789"
 *               name: "Jane Doe"
 *               email: "jane@example.com"
 */

router.patch("/:id",
    middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]),
    //body("previousName").trim().escape(),
    query("id").trim().escape(),
    body("newName").trim().escape(),
    body("newEmail").trim().normalizeEmail(),
    body("newPassword").trim().escape(),
    handle_validation_errors,
    editUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: "1"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64a8c123f1e6c2a1b2c56789"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 permissions:
 *                   ADMIN: false
 *                   CREATE_QUESTION: true
 *                   EDIT_QUESTION: true
 *                 score: 0
 *                 createdAt: "2025-11-10T12:34:56.789Z"
 *               - _id: "64a8c456f1e6c2a1b2c56790"
 *                 name: "Jane Doe"
 *                 email: "jane@example.com"
 *                 permissions:
 *                   ADMIN: false
 *                   CREATE_QUESTION: true
 *                   EDIT_QUESTION: true
 *                 score: 0
 *                 createdAt: "2025-11-10T12:35:56.789Z"
 */
router.get("/", getUsers);

export default router;