import { Router } from 'express';
import { getAssessments, createOrUpdateAssessment, deleteAssessment, submitAssessment } from '../controllers/assessment.controller';

const router = Router();

router.get('/', getAssessments);
router.post('/', createOrUpdateAssessment);
router.delete('/:id', deleteAssessment);
router.post('/:jobId/submit', submitAssessment);

export default router;
