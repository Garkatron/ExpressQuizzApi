import express from 'express';
import { authorize_permissions, middleware_authenticate_token } from '../middlewares/auth.js';
import { UserPermissions } from '../constants.js';
import { handle_validation_errors } from '../middlewares/sanitization.js';
import { body, param } from 'express-validator';
import { createCollection, deleteCollection, editCollection, getCollections } from '../controllers/CollectionController.js';


const router = express.Router();

/**
 * @swagger
 * /api/v1/collections:
 *   post:
 *     summary: Create a new collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Collection created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7b123f1e6c2a1b2c34567"
 *               name: "Sample Collection"
 *               tags: ["geography","history"]
 *               questions: ["64a7b0f8f1e6c2a1b2c12345","64a7b0faf1e6c2a1b2c12346"]
 *               owner: "64a7af12f1e6c2a1b2c12344"
 */

router.post(
  '/',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.CREATE_COLLECTION]),
  body('name').trim().escape(),
  body('tags').isArray().withMessage('Tags will be an Array'),
  body('questions').isArray().withMessage('Questios will be an Array'),
  handle_validation_errors,
  createCollection
);

/**
 * @swagger
 * /api/v1/collections/{id}:
 *   patch:
 *     summary: Edit a collection by ID
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
 *               name:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Collection edited successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7b123f1e6c2a1b2c34567"
 *               name: "Updated Collection"
 *               tags: ["geography","math"]
 *               questions: ["64a7b0f8f1e6c2a1b2c12345"]
 *               owner: "64a7af12f1e6c2a1b2c12344"
 */
router.patch(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.EDIT_COLLECTION]),
  param('id').trim().escape(),
  body('name').trim().escape().optional(),
  body('tags').isArray().withMessage('Tags will be an Array').optional(),
  body('questions').isArray().withMessage('Questios will be an Array').optional(),
  handle_validation_errors,
  editCollection
);

/**
 * @swagger
 * /api/v1/collections/{id}:
 *   delete:
 *     summary: Delete a collection by ID
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
 *         description: Collection deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "64a7b123f1e6c2a1b2c34567"
 *               name: "Deleted Collection"
 *               tags: ["geography","history"]
 *               questions: ["64a7b0f8f1e6c2a1b2c12345"]
 *               owner: "64a7af12f1e6c2a1b2c12344"
 */

router.delete(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.DELETE_COLLECTION]),
  param('id').trim().escape(),
  handle_validation_errors,
  deleteCollection
);

/**
 * @swagger
 * /api/v1/collections:
 *   get:
 *     summary: Get all collections
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: "64a7b123f1e6c2a1b2c34567"
 *                 name: "Sample Collection"
 *                 tags: ["geography","history"]
 *                 questions: ["64a7b0f8f1e6c2a1b2c12345","64a7b0faf1e6c2a1b2c12346"]
 *                 owner: "64a7af12f1e6c2a1b2c12344"
 *               - id: "64a7b456f1e6c2a1b2c34568"
 *                 name: "Math Collection"
 *                 tags: ["algebra","geometry"]
 *                 questions: ["64a7b0faf1e6c2a1b2c12347","64a7b101f1e6c2a1b2c12348"]
 *                 owner: "64a7af12f1e6c2a1b2c12344"
 */
router.get('/', getCollections);

// router.get('/id/:id', getCollectionsByID);
// router.get('/owner/:ownername', getCollectionsByOwner);
// router.post('/filter', getCollectionsFiltered);

export default router;