import pool from "../models/db";
import { queries } from "../models/queries";
import { Request, Response } from "express";

// Interfaces
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

interface CustomerCreate {
  name: string;
  email: string;
  phone: string;
  wallet_balance?: number;
}

interface WalletDeduction {
  customer_id: number;
  amount: number;
}

type CustomerParams = {
  id: string;
}

type WalletParams = {
  customer_id: string;
}

// Create a New Customer
export const createCustomer = async (
  req: Request<{}, {}, CustomerCreate>,
  res: Response
): Promise<void> => {
    try {
        const { name, email, phone, wallet_balance } = req.body;
        const result = await pool.query<Customer>(queries.createCustomer, [name, email, phone, wallet_balance]);
        res.status(201).json({ message: "Customer created successfully", customer: result.rows[0] });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Get All Customers
export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
    try {
        const result = await pool.query<Customer>(queries.getAllCustomers);
        res.status(200).json(result.rows);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Get a Specific Customer by ID
export const getCustomerById = async (
  req: Request<CustomerParams>,
  res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query<Customer>(queries.getCustomerById, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Update Customer Information
export const updateCustomer = async (
  req: Request<CustomerParams, {}, CustomerCreate>,
  res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const result = await pool.query<Customer>(queries.updateCustomer, [name, email, phone, id]);

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Delete a Customer
export const deleteCustomer = async (
  req: Request<CustomerParams>,
  res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await pool.query(queries.deleteCustomer, [id]);

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Fetch Current Wallet Balance for a Customer
export const getWalletBalance = async (
  req: Request<WalletParams>,
  res: Response
): Promise<void> => {
    try {
        const { customer_id } = req.params;
        const result = await pool.query<Customer>(queries.getWalletBalance, [customer_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        res.status(200).json({ wallet_balance: result.rows[0].wallet_balance });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};

// Deduct Charging Cost from Wallet After a Session
export const deductWalletBalance = async (
  req: Request<{}, {}, WalletDeduction>,
  res: Response
): Promise<void> => {
    try {
        const { customer_id, amount } = req.body;

        const walletResult = await pool.query<Customer>(queries.getWalletBalance, [customer_id]);
        if (walletResult.rows.length === 0) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        const walletBalance = walletResult.rows[0].wallet_balance;

        if (walletBalance < amount) {
            res.status(400).json({ error: "Insufficient wallet balance" }); //bad request
            return;
        }

        await pool.query(queries.deductWalletBalance, [amount, customer_id]);
        res.status(200).json({ message: "Wallet balance updated successfully" });
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({ error: error.message });
        }   
    }
};