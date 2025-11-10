import express from 'express';

import { body, param, query } from 'express-validator';
import { authorize_permissions, middleware_authenticate_token } from '../middlewares/auth.js';
import { UserPermissions } from '../constants.js';
import { handle_validation_errors } from '../middlewares/sanitization.js';
import { createQuestion, deleteQuestion, editQuestion, getQuestions } from '../controllers/QuestionController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7c123f1e6c2a1b2c56789"
 *               question_text: "What is the capital of France?"
 *               options: ["Paris", "London", "Berlin"]
 *               answer: "Paris"
 *               tags: ["geography", "europe"]
 *               owner: "64a7baf2f1e6c2a1b2c45678"
 */
router.delete(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.DELETE_QUESTION]),
  param('id').trim().escape(),
  handle_validation_errors,
  deleteQuestion
);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   patch:
 *     summary: Edit a question by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Question edited successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7c123f1e6c2a1b2c56789"
 *               question_text: "Updated question text"
 *               options: ["Option A", "Option B"]
 *               answer: "Option A"
 *               tags: ["geography", "history"]
 *               owner: "64a7baf2f1e6c2a1b2c45678"
 */
router.patch(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.EDIT_QUESTION]),
  param('id').trim().escape(),
  body('field').trim().escape(),
  body('value').trim().escape(),
  handle_validation_errors,
  editQuestion
);


/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Create a new question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answer:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7c123f1e6c2a1b2c56789"
 *               question_text: "Deleted question"
 *               options: ["Option A", "Option B"]
 *               answer: "Option A"
 *               tags: ["geography", "history"]
 *               owner: "64a7baf2f1e6c2a1b2c45678"
 */

router.post(
  '/',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.CREATE_QUESTION]),
  body('question_text').trim().escape(),
  body('options').isArray(),
  body('answer').trim().escape(),
  body('tags').isArray(),
  handle_validation_errors,
  createQuestion
);

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Get questions (all or filtered)
 *     parameters:
 *       - name: id
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *       - name: ownername
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: "64a7c123f1e6c2a1b2c56789"
 *                 question_text: "What is the capital of France?"
 *                 options: ["Paris", "London", "Berlin"]
 *                 answer: "Paris"
 *                 tags: ["geography", "europe"]
 *                 owner: "64a7baf2f1e6c2a1b2c45678"
 *               - id: "64a7c456f1e6c2a1b2c56790"
 *                 question_text: "What is 2 + 2?"
 *                 options: ["3", "4", "5"]
 *                 answer: "4"
 *                 tags: ["math", "arithmetic"]
 *                 owner: "64a7baf2f1e6c2a1b2c45678"
 */
router.get(
  '/',
  query('id').optional().trim().escape(),
  query('ownername').optional().trim().escape(),
  handle_validation_errors,
  getQuestions
);

// router.get('/owner/:ownername', getQuestionsByOwner);
// router.get('/id/:id', getQuestionByID);

export default router;