import {Router} from "express";
import {
    createStation,
    getAllStations,
    getStationById,
    updateStation,
    deleteStation
} from "../controllers/station.controller";
import { validateStation } from "../validate/validate.station";

const router = Router();

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Fetch all charging stations
 *     description: Retrieve a list of all charging stations.
 *     responses:
 *       200:
 *         description: A list of charging stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Station A"
 *                   location:
 *                     type: string
 *                     example: "123 Main St"
 */
router.get("/", getAllStations);
router.get("/:id", getStationById);
router.post("/create", validateStation, createStation);
router.put("/:id", validateStation, updateStation);
router.delete("/:id", deleteStation);

export default router;
