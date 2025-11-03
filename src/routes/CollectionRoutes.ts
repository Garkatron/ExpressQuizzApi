import express from 'express';
import { authorize_permissions, middleware_authenticate_token } from '../middlewares/auth.js';
import { UserPermissions } from '../constants.js';
import { handle_validation_errors } from '../middlewares/sanitization.js';
import { body, param } from 'express-validator';
import { createCollection, deleteCollection, editCollection, getCollections } from '../controllers/CollectionController.js';


const router = express.Router();

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

router.patch(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.EDIT_COLLECTION]),
  param('id').trim().escape(),
  body('name').trim().escape(),
  body('tags').isArray().withMessage('Tags will be an Array'),
  body('questions').isArray().withMessage('Questios will be an Array'),
  handle_validation_errors,
  editCollection
);

router.delete(
  '/:id',
  middleware_authenticate_token,
  authorize_permissions([UserPermissions.DELETE_COLLECTION]),
  param('id').trim().escape(),
  handle_validation_errors,
  deleteCollection
);

router.get('/', getCollections);

// router.get('/id/:id', getCollectionsByID);
// router.get('/owner/:ownername', getCollectionsByOwner);
// router.post('/filter', getCollectionsFiltered);

export default router;