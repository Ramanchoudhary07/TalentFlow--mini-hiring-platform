import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, resume, jobId, coverLetter, experience, education, skills } = req.body;

    // First check if the candidate already exists by email
    let candidate = await prisma.candidate.findUnique({
      where: { email: String(email) },
    });

    // If not, create the candidate
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          name,
          email: String(email),
          phone,
          resume,
          experience,
          education,
          skills: skills || [],
        },
      });
    }

    // Now create the application
    const application = await prisma.application.create({
      data: {
        jobId: String(jobId),
        candidateId: candidate.id,
        coverLetter,
        stage: 'applied',
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const newStage = req.body.status || req.body.stage;

    const application = await prisma.application.update({
      where: { id },
      data: { stage: newStage },
    });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.application.delete({
      where: { id },
    });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};
