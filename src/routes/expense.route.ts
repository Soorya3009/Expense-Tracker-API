import { Router } from "express";

import {
  addExpense,
  getExpenses,
  getExpenseById,
  searchExpenses,
  updateExpense,
  updateExpenseByTitle,
  deleteExpense,
  deleteExpenseByTitle,
} from "../controllers/expense.controller.js";

import { expenseValidators,updateExpenseValidators } from "../validators/expense.validators.js";
import { requestValidator } from "../middlewares/request.validators.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/add",authenticateUser, expenseValidators, requestValidator, addExpense);

router.get("/",authenticateUser, getExpenses);

router.get("/search",authenticateUser, searchExpenses);

router.get("/id/:id",authenticateUser,getExpenseById);

router.put("/id/:id",authenticateUser,updateExpenseValidators,requestValidator,updateExpense);

router.put("/title/:title",authenticateUser,updateExpenseValidators,requestValidator,updateExpenseByTitle);

router.delete("/id/:id", authenticateUser, deleteExpense);

router.delete("/title/:title", authenticateUser,  deleteExpenseByTitle);

export default router;
