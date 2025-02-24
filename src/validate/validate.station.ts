import { Request, Response, NextFunction } from "express";

export interface ValidateStationRequest {
    name: string;
    address: string;
    business_unit: string;
    tariff_id: number;
}

export const validateStation = async (
    req: Request<{}, {}, ValidateStationRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, address, business_unit, tariff_id } = req.body;

        // Check if all required fields are present
        if (!name || !address || !business_unit || !tariff_id) {
            res.status(400).json({
                error: "All fields (name, address, business_unit, tariff_id) are required"
            });
            return;
        }

        // Validate string fields are not empty after trimming
        if (!name.trim() || !address.trim() || !business_unit.trim()) {
            res.status(400).json({
                error: "Name, address, and business unit cannot be empty strings"
            });
            return;
        }

        // Validate tariff_id is a positive number
        if (typeof tariff_id !== 'number' || isNaN(tariff_id) || tariff_id <= 0) {
            res.status(400).json({
                error: "tariff_id must be a positive number"
            });
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