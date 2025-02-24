import { Request, Response, NextFunction } from "express";
import pool from "../models/db";
import { queries } from "../models/queries";

export interface ValidateSessionStartRequest {
    customer_id: number;
    charging_station_id: number;
    charge_point_id: number;
    connector_id: number;
}

export interface ValidateSessionStopRequest {
    session_id: number;
}

interface WalletResult {
    wallet_balance: number;
}

interface ChargePointData {
    tariff_id: number;
    charger_type: 'AC' | 'DC';
}

interface TariffData {
    type: 'duration_based' | 'units_based';
    price_ac: number;
    price_dc: number;
}

export const validateStartSession = async (
    req: Request<{}, {}, ValidateSessionStartRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { customer_id, charge_point_id } = req.body;

        // Validate required fields
        if (!customer_id || !charge_point_id) {
            res.status(400).json({
                error: "customer_id and charge_point_id are required"
            });
            return;
        }

        // Check Customer Wallet Balance
        const walletResult = await pool.query<WalletResult>(
            queries.getWalletBalance,
            [customer_id]
        );

        if (walletResult.rows.length === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        const walletBalance = walletResult.rows[0].wallet_balance;

        // Fetch Charge Point Details
        const chargePointResult = await pool.query<ChargePointData>(
            "SELECT tariff_id, charger_type FROM charge_point WHERE id = $1",
            [charge_point_id]
        );

        if (chargePointResult.rows.length === 0) {
            res.status(404).json({ error: "Charge point not found" });
            return;
        }

        const { tariff_id, charger_type } = chargePointResult.rows[0];

        // Fetch Tariff Details
        const tariffResult = await pool.query<TariffData>(
            "SELECT type, price_ac, price_dc FROM tariff WHERE id = $1",
            [tariff_id]
        );

        if (tariffResult.rows.length === 0) {
            res.status(404).json({ error: "Tariff not found" });
            return;
        }

        // Store tariff data in request for use in the controller
        res.locals.tariffData = {
            ...tariffResult.rows[0],
            chargerType: charger_type,
            walletBalance: walletBalance
        };

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            return;
        }
        next(error);
    }
};

export const validateStopSession = async (
    req: Request<{ session_id: string }, {}, ValidateSessionStopRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { session_id } = req.params;

        if (!session_id) {
            res.status(400).json({ error: "session_id is required" });
            return;
        }

        // Check if session exists and is active
        const sessionResult = await pool.query(
            queries.getSessionById,
            [session_id]
        );

        if (sessionResult.rows.length === 0) {
            res.status(404).json({ error: "Session not found" });
            return;
        }

        if (sessionResult.rows[0].status !== 'active') {
            res.status(400).json({ error: "Session is already inactive" });
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