import { Request, Response, NextFunction } from "express";
import pool from "../models/db";

interface ChargingPointCreate {
    charging_station_id: number;
    charger_type: 'AC' | 'DC';
    tariff_id: number;
}

// Validate Charging Point Creation
export const validateChargingPoint = async (
    req: Request<{}, {}, ChargingPointCreate>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { charging_station_id, charger_type, tariff_id } = req.body;

        // Check if Charging Station Exists
        const stationResult = await pool.query(
            "SELECT id FROM charging_station WHERE id = $1",
            [charging_station_id]
        );
        
        if (stationResult.rows.length === 0) {
            res.status(404).json({ error: "Charging station not found" });
            return;
        }

        // Check if Tariff Exists
        const tariffResult = await pool.query(
            "SELECT id FROM tariff WHERE id = $1",
            [tariff_id]
        );
        
        if (tariffResult.rows.length === 0) {
            res.status(404).json({ error: "Tariff not found" });
            return;
        }

        // Validate Charger Type
        if (!["AC", "DC"].includes(charger_type)) {
            res.status(400).json({ error: "Invalid charger type, must be 'AC' or 'DC'" });
            return;
        }

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            return;
        }
        next(error);
    }
};