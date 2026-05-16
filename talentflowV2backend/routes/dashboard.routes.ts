import { Router } from 'express';
import { getDashboardStatistics } from '../controllers/dashboard.controller';

const router = Router();

router.get('/statistics', getDashboardStatistics);

export default router;
