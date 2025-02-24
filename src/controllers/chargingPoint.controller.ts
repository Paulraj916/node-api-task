import pool from "../models/db";
import { queries } from "../models/queries";
import { Request, Response } from "express";

// Interfaces
interface ChargingPoint {
   id: number;
   charging_station_id: number; 
   charger_type: 'AC' | 'DC';
   tariff_id: number;
}

interface ChargingPointCreate {
   charging_station_id: number;
   charger_type: 'AC' | 'DC';
   tariff_id: number;
}

interface ConnectorUpdate {
   type: string;
}

type ChargingPointParams = {
   id: string;
}

type ConnectorParams = {
   connector_id: string;
}

// Create Charging Point
export const createChargingPoint = async (
   req: Request<{}, {}, ChargingPointCreate>,
   res: Response
): Promise<void> => {
   try {
       const { charging_station_id, charger_type, tariff_id } = req.body;

       const result = await pool.query<ChargingPoint>(
           queries.createChargingPoint,
           [charging_station_id, charger_type, tariff_id]
       );
       
       res.status(201).json({
           message: "Charging point created successfully",
           chargingPoint: result.rows[0]
       });
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       }
   }
};

// Get All Charging Points
export const getAllChargingPoints = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
       const result = await pool.query<ChargingPoint>(queries.getAllChargingPoints);
       res.status(200).json(result.rows);
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       }
   }
};

// Get Charging Point by ID
export const getChargingPointById = async (
   req: Request<ChargingPointParams>,
   res: Response
): Promise<void> => {
   try {
       const { id } = req.params;
       const result = await pool.query<ChargingPoint>(
           queries.getChargingPointById,
           [id]
       );

       if (result.rows.length === 0) {
           res.status(404).json({ error: "Charging point not found" });
           return;
       }

       res.status(200).json(result.rows[0]);
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       }
   }
};

// Update Charging Point
export const updateChargingPoint = async (
   req: Request<ChargingPointParams, {}, Partial<ChargingPointCreate>>,
   res: Response
): Promise<void> => {
   try {
       const { id } = req.params;
       const { charger_type, tariff_id } = req.body;

       const result = await pool.query<ChargingPoint>(
           queries.updateChargingPoint,
           [charger_type, tariff_id, id]
       );

       if (result.rowCount === 0) {
           res.status(404).json({ error: "Charging point not found" });
           return;
       }

       res.status(200).json({ message: "Charging point updated successfully" });
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       }
   }
};

// Delete Charging Point
export const deleteChargingPoint = async (
   req: Request<ChargingPointParams>,
   res: Response
): Promise<void> => {
   try {
       const { id } = req.params;
       const result = await pool.query(queries.deleteChargingPoint, [id]);

       if (result.rowCount === 0) {
           res.status(404).json({ error: "Charging point not found" });
           return;
       }

       res.status(200).json({ message: "Charging point deleted successfully" });
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       }
   }
};

// Update connector
export const updateConnector = async (
   req: Request<ConnectorParams, {}, ConnectorUpdate>,
   res: Response
): Promise<void> => {
   try {
       const { connector_id } = req.params;
       const { type } = req.body;

       const result = await pool.query(
           queries.updateConnector,
           [type, connector_id]
       );

       if (result.rows.length === 0) {
           res.status(404).json({ error: "Connector not found" });
           return;
       }

       res.status(200).json({
           message: "Connector updated successfully",
           data: result.rows[0]
       });
   } catch (error) {
       if (error instanceof Error) {
           res.status(500).json({ error: error.message });
       } else {
           res.status(500).json({ error: "An unknown error occurred" });
       }
   }
};