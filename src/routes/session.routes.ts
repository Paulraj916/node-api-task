import {Router} from "express";
import { startSession, stopSession,getAllSession, getSessionHistory, getTotalSessionsPerCharger } from "../controllers/session.controller";
import { validateStartSession, validateStopSession } from "../validate/validate.session";

const router = Router();

router.get("/",getAllSession)
router.post("/start", validateStartSession, startSession);
router.post("/stop/:session_id", validateStopSession, stopSession);
router.get("/session-history/:customer_id", getSessionHistory);
router.get("/total-sessions", getTotalSessionsPerCharger);

export default router;
