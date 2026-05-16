"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();
router.post('/', application_controller_1.submitApplication);
router.patch('/:id/status', application_controller_1.updateApplicationStatus);
router.delete('/:id', application_controller_1.deleteApplication);
exports.default = router;
