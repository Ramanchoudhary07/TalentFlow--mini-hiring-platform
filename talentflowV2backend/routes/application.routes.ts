import { Router } from 'express';
import { submitApplication, updateApplicationStatus, deleteApplication } from '../controllers/application.controller';

const router = Router();

router.post('/', submitApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
