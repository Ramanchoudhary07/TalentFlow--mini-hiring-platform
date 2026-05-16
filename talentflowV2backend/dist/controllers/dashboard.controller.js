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
exports.getDashboardStatistics = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const getDashboardStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // We need to return stats that the frontend HrDashboard expects.
        // The frontend mock might look like: 
        // {
        //   totalCandidates: number,
        //   activeJobs: number,
        //   interviewsScheduled: number,
        //   offersSent: number
        // }
        const totalCandidatesCount = yield prisma_1.default.candidate.count();
        const activeJobsCount = yield prisma_1.default.job.count({
            where: { status: 'active' }
        });
        const interviewsScheduledCount = yield prisma_1.default.application.count({
            where: { stage: 'interview' }
        });
        const offersSentCount = yield prisma_1.default.application.count({
            where: { stage: 'offer' }
        });
        res.json({
            totalCandidates: totalCandidatesCount,
            activeJobs: activeJobsCount,
            interviewsScheduled: interviewsScheduledCount,
            offersSent: offersSentCount,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
});
exports.getDashboardStatistics = getDashboardStatistics;
