import { Router } from "express";
import expenseRouter from "./expense.route.js";
import userRouter from "./user.route.js";

const router=Router();

router.use('/expense',expenseRouter);
router.use("/users",userRouter);

export default router;
