import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.query;

    const query: any = {
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    };

    if (jobId) {
      query.where = { jobId: String(jobId) };
    }

    const assessments = await prisma.assessment.findMany(query);
    res.json({
      data: assessments,
      total: assessments.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
};

export const createOrUpdateAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, title, description, sections } = req.body;

    const existing = await prisma.assessment.findFirst({
      where: { jobId: String(jobId) },
    });

    if (existing) {
      await prisma.assessmentSection.deleteMany({
        where: { assessmentId: existing.id },
      });

      const updatedAssessment = await prisma.assessment.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          sections: {
            create: sections.map((section: any, sIdx: number) => ({
              title: section.title,
              order: sIdx,
              questions: {
                create: section.questions.map((q: any, qIdx: number) => ({
                  type: q.type,
                  question: q.question,
                  options: q.options || [],
                  required: q.required || false,
                  validation: q.validation || {},
                  conditional: q.conditionalOn || null,
                  order: qIdx,
                })),
              },
            })),
          },
        },
        include: { sections: { include: { questions: true } } },
      });
      res.json(updatedAssessment);
    } else {
      const newAssessment = await prisma.assessment.create({
        data: {
          jobId: String(jobId),
          title,
          description,
          sections: {
            create: sections.map((section: any, sIdx: number) => ({
              title: section.title,
              order: sIdx,
              questions: {
                create: section.questions.map((q: any, qIdx: number) => ({
                  type: q.type,
                  question: q.question,
                  options: q.options || [],
                  required: q.required || false,
                  validation: q.validation || {},
                  conditional: q.conditionalOn || null,
                  order: qIdx,
                })),
              },
            })),
          },
        },
        include: { sections: { include: { questions: true } } },
      });
      res.status(201).json(newAssessment);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save assessment' });
  }
};

export const deleteAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.assessment.delete({
      where: { id },
    });
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete assessment' });
  }
};

export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = String(req.params.jobId);
    const { candidateId, responses } = req.body;

    const assessment = await prisma.assessment.findFirst({
      where: { jobId },
    });

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found for this job' });
      return;
    }

    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId: assessment.id,
        candidateId: String(candidateId),
        responses,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit assessment responses' });
  }
};
