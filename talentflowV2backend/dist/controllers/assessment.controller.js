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
exports.submitAssessment = exports.deleteAssessment = exports.createOrUpdateAssessment = exports.getAssessments = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const getAssessments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.query;
        const query = {
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
        const assessments = yield prisma_1.default.assessment.findMany(query);
        res.json(assessments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch assessments' });
    }
});
exports.getAssessments = getAssessments;
const createOrUpdateAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, title, description, sections } = req.body;
        const existing = yield prisma_1.default.assessment.findFirst({
            where: { jobId: String(jobId) },
        });
        if (existing) {
            yield prisma_1.default.assessmentSection.deleteMany({
                where: { assessmentId: existing.id },
            });
            const updatedAssessment = yield prisma_1.default.assessment.update({
                where: { id: existing.id },
                data: {
                    title,
                    description,
                    sections: {
                        create: sections.map((section, sIdx) => ({
                            title: section.title,
                            order: sIdx,
                            questions: {
                                create: section.questions.map((q, qIdx) => ({
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
        }
        else {
            const newAssessment = yield prisma_1.default.assessment.create({
                data: {
                    jobId: String(jobId),
                    title,
                    description,
                    sections: {
                        create: sections.map((section, sIdx) => ({
                            title: section.title,
                            order: sIdx,
                            questions: {
                                create: section.questions.map((q, qIdx) => ({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save assessment' });
    }
});
exports.createOrUpdateAssessment = createOrUpdateAssessment;
const deleteAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield prisma_1.default.assessment.delete({
            where: { id },
        });
        res.json({ message: 'Assessment deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete assessment' });
    }
});
exports.deleteAssessment = deleteAssessment;
const submitAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = String(req.params.jobId);
        const { candidateId, responses } = req.body;
        const assessment = yield prisma_1.default.assessment.findFirst({
            where: { jobId },
        });
        if (!assessment) {
            res.status(404).json({ message: 'Assessment not found for this job' });
            return;
        }
        const submission = yield prisma_1.default.assessmentSubmission.create({
            data: {
                assessmentId: assessment.id,
                candidateId: String(candidateId),
                responses,
            },
        });
        res.status(201).json(submission);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit assessment responses' });
    }
});
exports.submitAssessment = submitAssessment;
