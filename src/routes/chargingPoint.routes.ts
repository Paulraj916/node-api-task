import { Router } from "express";
import {
    createChargingPoint,
    getAllChargingPoints,
    getChargingPointById,
    updateChargingPoint,
    deleteChargingPoint,
    updateConnector
} from "../controllers/chargingPoint.controller";
import { validateChargingPoint } from "../validate/validate.chargingPoint";

const router = Router();

router.post("/create", validateChargingPoint, createChargingPoint);
router.get("/", getAllChargingPoints);
router.get("/:id", getChargingPointById);
router.put("/:id", validateChargingPoint, updateChargingPoint);
router.delete("/:id", deleteChargingPoint);
router.put("/connector/:connector_id", updateConnector);

export default router;
