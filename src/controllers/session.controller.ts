import pool from "../models/db";
import { queries } from "../models/queries";
import {Request,Response} from "express";

// Start a New Charging Session
export const startSession = async (req: Request, res: Response) => {
    try {
        const { customer_id, charging_station_id, charge_point_id, connector_id, charge_duration, units_consumed_kwh } = req.body;

        // Start Charging Session (Status defaults to 'active')
        const result = await pool.query(queries.createSession, [
            customer_id, charging_station_id, charge_point_id, connector_id, charge_duration, units_consumed_kwh, 'active'
        ]);

        res.status(201).json({ message: "Charging session started", session: result.rows[0] });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

export const getAllSession = async(req: Request, res: Response)=>{
    try {
        const result = await pool.query(queries.getAllSession);
        res.status(200).json(result.rows);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
}

// Stop Charging Session
export const stopSession = async (req: Request, res: Response) => {
    try {
        const { session_id } = req.params;

        // Update Session Status to 'inactive'
        await pool.query(queries.updateSessionStatus, ['inactive', session_id]);

        res.status(200).json({ message: "Session stopped successfully" });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Get Session History for a Customer
export const getSessionHistory = async (req: Request, res: Response) => {
    try {
        const { customer_id } = req.params;
        const result = await pool.query(queries.getSessionHistory, [customer_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Get Total Sessions Per Charger
export const getTotalSessionsPerCharger = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(queries.getTotalSessionsPerCharger);
        res.status(200).json(result.rows);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};
