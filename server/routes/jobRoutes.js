import express from 'express';
import { postJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/post', authenticate, postJob);

export default router;
