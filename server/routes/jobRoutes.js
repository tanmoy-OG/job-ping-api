import express from 'express';
import { postJob, sendJobUpdates } from '../controllers/jobController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/post', authenticate, postJob);
router.post('/notify', authenticate, sendJobUpdates);

export default router;
