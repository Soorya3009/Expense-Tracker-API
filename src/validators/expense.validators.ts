import {body} from "express-validator";

export const expenseValidators=[
    body("title").isString().withMessage("Only string values are awolled.").bail().trim().notEmpty().withMessage("Title is required"),

    body("amount").isFloat({min:0}).withMessage("Amount must be a non-negative number"),

    body("category").isString().withMessage("Only string values are awolled.").bail().trim().notEmpty().withMessage("Category is required"),

];

export const updateExpenseValidators=[
    body("title").optional().isString().withMessage("Title must be a string").bail().trim().notEmpty().withMessage("Title cannot be empty"),
    
    body("amount").optional().isFloat({min:0}).withMessage("Amount must be a non-negative number"),

    body("category").optional().isString().withMessage("Category must be a string").bail().trim().notEmpty().withMessage("Category cannot be empty"),

];