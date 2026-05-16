import { Router } from 'express';
import { getCandidates, getCandidateById, updateCandidate, getCandidateTimeline } from '../controllers/candidate.controller';

const router = Router();

router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.patch('/:id', updateCandidate);
router.get('/:id/timeline', getCandidateTimeline);

export default router;
