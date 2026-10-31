import type{Request,Response} from "express";
import Counter from "../models/Counter.js";
import Expense from"../models/Expense.js";
import {successResponse,errorResponse}from "../utils/response.js";

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, date } = req.body;
    const { userId } = res.locals.user as { userId: string};

    let counter = await Counter.findOne({ _id: "expenseId" });

    if (!counter) {
      counter = await Counter.create({
        _id: "expenseId",
        sequence_value: 1,
      });
    } else {
      counter.sequence_value = counter.sequence_value + 1;
      await counter.save();
    }

    const expense = await Expense.create({
      id: counter.sequence_value,
      userId,
      title,
      amount,
      category,
      date,
    });

    return successResponse(
      res,
      "Expense created successfully",
      expense,
      201
    );
  } catch (error) {
    console.error("Error creating expense:", error);

    return errorResponse(res, "Failed to create expense");
  }
};



export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { userId }= res.locals.user as { userId: string };
    const expenses = await Expense.find({ userId });

    return successResponse(
      res,
      "Expenses fetched successfully",
      {
        count: expenses.length,
        expenses,
      }
    
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);

    return errorResponse(res, "Failed to fetch expense");
  }
};



export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { userId } = res.locals.user as { userId: string };
    if (!Number.isInteger(id) || id < 1) {
      return errorResponse(res, "Invalid expense ID",400);
    }

    const expense = await Expense.findOne({ id, userId  });

    if (!expense) {
      return errorResponse(res, "Expense not found",404);
    }

    return successResponse(
      res,
      "Expense fetched successfully",
      expense
    );
  } catch (error) {
    console.error("Error fetching expense:", error);

    return errorResponse(res,"Failed to fetch expense");
  }
};


export const searchExpenses = async (req: Request, res: Response) => {
  try {
    const { title, amount, category } = req.query;
    const { userId } = res.locals.user as { userId: string };


    const filter: {
      userId: string;
      title?: string;
      amount?: number;
      category?: string;
    } = {
      userId,
    };

    if (title) {
      filter.title = String(title);
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        return errorResponse(
          res,
          "Amount must be a non-negative number",
          400
        );
      }

      filter.amount = parsedAmount;
    }

    if (category) {
      filter.category = String(category);
    }

    const expenses = await Expense.find(filter);

    return successResponse(
      res,
      "Expenses searched successfully",
      {
        count:expenses.length,
        expenses,
      }
    );
  } catch (error) {
    console.error("Error searching expenses:", error);

    return errorResponse(res,"Failed to search expenses");
  }
};



export const updateExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, amount, category, date } = req.body;
    const { userId } = res.locals.user as { userId: string };

    if (!Number.isInteger(id) || id < 1) {
      return errorResponse(res,"Invalid expense ID",400);
    }

    const expense = await Expense.findOneAndUpdate(
      { id,userId},
      { title, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return errorResponse(res,"Expense not found",404);
    }

    return successResponse(
      res,
      "Expense updated successfully",
      expense
    );
  } catch (error) {
    console.error("Error updating expense:", error);

    return errorResponse(res,"Failed to update expense");
  }
};



export const updateExpenseByTitle = async (
  req: Request,
  res: Response
) => {
  try {
    const { title } = req.params;
    const { amount, category, date } = req.body;
    const { userId } = res.locals.user as { userId: string };
    const expense = await Expense.findOneAndUpdate(
      { title, userId},
      { amount, category, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return errorResponse(res,"Expense not found",404);
    }

    return successResponse(
      res,
      "Expense updated successfully",
      expense
    );
  } catch (error) {
    console.error("Error updating expense:", error);

    return errorResponse(res,"Failed to update expense");
  }
};



export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { userId } = res.locals.user as { userId: string };

    if (!Number.isInteger(id) || id < 1) {
      return errorResponse(res,"Invalid expense Id",400);
    }
    const expense = await Expense.findOneAndDelete({ id,userId });

    if (!expense) {
      return errorResponse(res,"Expense not found", 404);
    }

    return successResponse(
      res,
      "Expense deleted successfully",
      expense
    );
  } catch (error) {
    console.error("Error deleting expense:", error);

    return errorResponse(res, "Failed to delete expense");
  }
};



export const deleteExpenseByTitle = async (
  req: Request,
  res: Response
) => {
  try {
    const { title } = req.params;
    const { userId } = res.locals.user as { userId: string };
    const expense = await Expense.findOneAndDelete({
      title,
      userId
    });

    if (!expense) {
      return errorResponse(res,"Expense not found",404);
    }

    return successResponse(
      res,
      "Expense deleted successfully",
      expense
    );
  } catch (error) {
    console.error("Error deleting expense:", error);

    return errorResponse(res, "Failed to delete expense");
  }
};
