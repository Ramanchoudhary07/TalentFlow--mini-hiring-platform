"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const assessment_routes_1 = __importDefault(require("./routes/assessment.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
// Frontend expects routes without /api prefix based on the mock setup
// So we mount them directly on the root path
app.use('/jobs', job_routes_1.default);
app.use('/candidates', candidate_routes_1.default);
app.use('/applications', application_routes_1.default);
app.use('/assessments', assessment_routes_1.default);
app.use('/dashboard', dashboard_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TalentFlow V2 Backend is running' });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
