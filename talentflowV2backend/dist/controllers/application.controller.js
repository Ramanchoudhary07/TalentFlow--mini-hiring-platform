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
exports.deleteApplication = exports.updateApplicationStatus = exports.submitApplication = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, resume, jobId, coverLetter, experience, education, skills } = req.body;
        // First check if the candidate already exists by email
        let candidate = yield prisma_1.default.candidate.findUnique({
            where: { email: String(email) },
        });
        // If not, create the candidate
        if (!candidate) {
            candidate = yield prisma_1.default.candidate.create({
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
        const application = yield prisma_1.default.application.create({
            data: {
                jobId: String(jobId),
                candidateId: candidate.id,
                coverLetter,
                stage: 'applied',
            },
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit application' });
    }
});
exports.submitApplication = submitApplication;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const newStage = req.body.status || req.body.stage;
        const application = yield prisma_1.default.application.update({
            where: { id },
            data: { stage: newStage },
        });
        res.json(application);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update application status' });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield prisma_1.default.application.delete({
            where: { id },
        });
        res.json({ message: 'Application deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete application' });
    }
});
exports.deleteApplication = deleteApplication;
