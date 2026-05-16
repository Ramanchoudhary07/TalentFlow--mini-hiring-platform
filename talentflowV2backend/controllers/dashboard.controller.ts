import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getDashboardStatistics = async (req: Request, res: Response): Promise<void> => {
  try {

    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({
      where: { status: 'active' }
    });

    const totalCandidates = await prisma.candidate.count();
    const newCandidates = await prisma.candidate.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    });

    const totalAssessments = await prisma.assessment.count();
    const completedAssessments = await prisma.assessmentSubmission.count();

    const totalApplications = await prisma.application.count();
    const interviewsScheduled = await prisma.application.count({
      where: { stage: 'interview' }
    });

    const offersPending = await prisma.application.count({
      where: { stage: 'offer' }
    });

    const hiredCandidates = await prisma.application.count({
      where: { stage: 'hired' }
    });

    res.json({
      totalJobs: totalJobs,
      activeJobs: activeJobs,
      totalCandidates: totalCandidates,
      newCandidates: newCandidates,
      totalAssessments: totalAssessments,
      completedAssessments: completedAssessments,
      totalApplications: totalApplications,
      interviewsScheduled: interviewsScheduled,
      offersPending: offersPending,
      hiredCandidates: hiredCandidates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};
