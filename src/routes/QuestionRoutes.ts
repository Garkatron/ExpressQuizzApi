import express from 'express';

import { body, param, query } from 'express-validator';
import { authorize_permissions, middleware_authenticate_token } from '../middlewares/auth.js';
import { UserPermissions } from '../constants.js';
import { handle_validation_errors } from '../middlewares/sanitization.js';
import { createQuestion, deleteQuestion, editQuestion, getQuestions } from '../controllers/QuestionController.js';

const router = express.Router();

router.delete(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.DELETE_QUESTION]),
  param('id').trim().escape(),
  handle_validation_errors,
  deleteQuestion
);

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