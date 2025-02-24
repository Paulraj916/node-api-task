import pool from "../models/db";
import { queries } from "../models/queries";
import {Request,Response} from "express";

interface Station {
    id: number;
    name: string;
    address: string;
    business_unit: string;
    tariff_id: number;
}

export const createStation = async (req: Request, res: Response) => {
    try {
        const { name, address, business_unit, tariff_id } = req.body;
        const result = await pool.query(queries.createStation, [name, address, business_unit, tariff_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

export const getAllStations = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(queries.getAllStations);
        res.status(200).json(result.rows);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

export const getStationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query<Station>(queries.getStationById, [id]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Station not found" });
            return;
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
};


export const updateStation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, address, business_unit, tariff_id } = req.body;
        const result = await pool.query(queries.updateStation, [name, address, business_unit, tariff_id, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

export const deleteStation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(queries.deleteStation, [id]);
        res.status(200).json({ message: "Station deleted successfully", deletedStation: result.rows[0] });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};
