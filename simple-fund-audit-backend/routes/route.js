import { Router } from "express";

const router = Router();

import { getTransactionHist, transfer, getBalance } from "../controller/appController.js";


router.post("/transfer", transfer);

router.get("/transactions/:userId", getTransactionHist);

router.get("/balance/:userId", getBalance);



export default router;