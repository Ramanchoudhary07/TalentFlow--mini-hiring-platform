"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderJobs = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobById = exports.getJobs = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const search = req.query.search;
        const status = req.query.status;
        const where = {};
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
        const total = yield prisma_1.default.job.count({ where });
        const jobs = yield prisma_1.default.job.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});
exports.getJobs = getJobs;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const job = yield prisma_1.default.job.findUnique({
            where: { id },
        });
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch job' });
    }
});
exports.getJobById = getJobById;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, tags, requirements, description, salary, location, jobType } = req.body;
        // Generate a simple slug
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const job = yield prisma_1.default.job.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create job' });
    }
});
exports.createJob = createJob;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const job = yield prisma_1.default.job.update({
            where: { id },
            data: req.body,
        });
        res.json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update job' });
    }
});
exports.updateJob = updateJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield prisma_1.default.job.delete({
            where: { id },
        });
        res.json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete job' });
    }
});
exports.deleteJob = deleteJob;
const reorderJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const job = yield prisma_1.default.job.update({
            where: { id },
            data: { order: req.body.order },
        });
        res.json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reorder jobs' });
    }
});
exports.reorderJobs = reorderJobs;
