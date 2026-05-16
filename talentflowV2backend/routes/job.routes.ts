import { Router } from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob, reorderJobs } from '../controllers/job.controller';

const router = Router();

router.get('/', getJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/reorder', reorderJobs);

export default router;
