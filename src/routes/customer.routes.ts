import {Router} from "express";
import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getWalletBalance,
    deductWalletBalance
} from "../controllers/customer.controller";
import { validateCustomer } from "../validate/validate.customer";

const router = Router();

router.post("/create", validateCustomer, createCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", validateCustomer, updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/wallet/:customer_id", getWalletBalance);
router.post("/wallet/deduct", deductWalletBalance);

export default router;
