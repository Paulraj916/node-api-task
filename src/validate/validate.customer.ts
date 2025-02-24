// validate.customer.ts
import { Request, Response, NextFunction } from "express";

interface CustomerRequest {
  name: string;
  email: string;
  phone: string;
  wallet_balance?: number;
}

export const validateCustomer = async (
  req: Request<{}, {}, CustomerRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, wallet_balance } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Validate wallet balance
    if (wallet_balance !== undefined && isNaN(wallet_balance)) {
      res.status(400).json({ error: "Wallet balance must be a number" });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
};