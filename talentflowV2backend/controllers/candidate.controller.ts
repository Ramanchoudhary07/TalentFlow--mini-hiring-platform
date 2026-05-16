import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    // The frontend expects "candidates" which in our schema is actually Applications + Candidate info.
    const applications = await prisma.application.findMany({
      include: {
        candidate: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Map to frontend expected structure
    const formattedCandidates = applications.map((app) => ({
      id: app.id, // Using application ID as the primary identifier for the card
      name: app.candidate.name,
      email: app.candidate.email,
      phone: app.candidate.phone,
      resume: app.candidate.resume,
      notes: app.candidate.notes,
      skills: app.candidate.skills,
      experience: app.candidate.experience,
      education: app.candidate.education,
      stage: app.stage,
      jobId: app.jobId,
      appliedAt: app.appliedAt,
      updatedAt: app.updatedAt,
      coverLetter: app.coverLetter,
      candidateId: app.candidate.id, // Keep the real candidate ID just in case
    }));

    // Some frontend pages expect { data: [] } and some expect just []
    // The mock data returned { data: candidates } in Candidates.tsx
    res.json({ data: formattedCandidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch candidates' });
  }
};

export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = String(req.params.id);
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true, job: true },
    });

    if (!application) {
      res.status(404).json({ message: 'Candidate/Application not found' });
      return;
    }

    const formattedCandidate = {
      id: application.id,
      name: application.candidate.name,
      email: application.candidate.email,
      phone: application.candidate.phone,
      resume: application.candidate.resume,
      notes: application.candidate.notes,
      skills: application.candidate.skills,
      experience: application.candidate.experience,
      education: application.candidate.education,
      stage: application.stage,
      jobId: application.jobId,
      jobTitle: application.job?.title,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt,
      coverLetter: application.coverLetter,
      candidateId: application.candidate.id,
    };

    res.json(formattedCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch candidate' });
  }
};

export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = String(req.params.id);
    const { stage, notes, ...candidateData } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    // Update Application specific fields
    if (stage !== undefined) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { stage },
      });
    }

    // Update Candidate specific fields
    if (Object.keys(candidateData).length > 0 || notes !== undefined) {
      await prisma.candidate.update({
        where: { id: application.candidateId },
        data: {
          ...candidateData,
          notes: notes !== undefined ? notes : undefined,
        },
      });
    }

    res.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update candidate' });
  }
};

export const getCandidateTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    // Mock timeline data for now since we don't have a timeline table
    const timeline = [
      { id: 1, action: "Applied for position", date: new Date().toISOString() },
      { id: 2, action: "Resume screened", date: new Date().toISOString() }
    ];
    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch timeline' });
  }
};
