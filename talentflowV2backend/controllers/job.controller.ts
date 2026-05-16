import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const total = await prisma.job.count({ where });
    
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { order: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    res.json({
      data: jobs,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const job = await prisma.job.findUnique({
      where: { id },
    });
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, status, tags, requirements, description, salary, location, jobType } = req.body;
    
    // Generate a simple slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const job = await prisma.job.create({
      data: {
        title,
        slug,
        status: status || 'active',
        tags: tags || [],
        requirements: requirements || [],
        description: description || '',
        salary,
        location,
        jobType,
      },
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const job = await prisma.job.update({
      where: { id },
      data: req.body,
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.job.delete({
      where: { id },
    });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
};

export const reorderJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const job = await prisma.job.update({
      where: { id },
      data: { order: req.body.order },
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reorder jobs' });
  }
};
