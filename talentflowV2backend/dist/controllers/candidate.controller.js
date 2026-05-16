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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidateTimeline = exports.updateCandidate = exports.getCandidateById = exports.getCandidates = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const getCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // The frontend expects "candidates" which in our schema is actually Applications + Candidate info.
        const applications = yield prisma_1.default.application.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch candidates' });
    }
});
exports.getCandidates = getCandidates;
const getCandidateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const applicationId = String(req.params.id);
        const application = yield prisma_1.default.application.findUnique({
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
            jobTitle: (_a = application.job) === null || _a === void 0 ? void 0 : _a.title,
            appliedAt: application.appliedAt,
            updatedAt: application.updatedAt,
            coverLetter: application.coverLetter,
            candidateId: application.candidate.id,
        };
        res.json(formattedCandidate);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch candidate' });
    }
});
exports.getCandidateById = getCandidateById;
const updateCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicationId = String(req.params.id);
        const _a = req.body, { stage, notes } = _a, candidateData = __rest(_a, ["stage", "notes"]);
        const application = yield prisma_1.default.application.findUnique({
            where: { id: applicationId },
        });
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        // Update Application specific fields
        if (stage !== undefined) {
            yield prisma_1.default.application.update({
                where: { id: applicationId },
                data: { stage },
            });
        }
        // Update Candidate specific fields
        if (Object.keys(candidateData).length > 0 || notes !== undefined) {
            yield prisma_1.default.candidate.update({
                where: { id: application.candidateId },
                data: Object.assign(Object.assign({}, candidateData), { notes: notes !== undefined ? notes : undefined }),
            });
        }
        res.json({ message: 'Candidate updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update candidate' });
    }
});
exports.updateCandidate = updateCandidate;
const getCandidateTimeline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mock timeline data for now since we don't have a timeline table
        const timeline = [
            { id: 1, action: "Applied for position", date: new Date().toISOString() },
            { id: 2, action: "Resume screened", date: new Date().toISOString() }
        ];
        res.json(timeline);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch timeline' });
    }
});
exports.getCandidateTimeline = getCandidateTimeline;
