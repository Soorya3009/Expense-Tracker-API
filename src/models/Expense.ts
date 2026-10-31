import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    id:{
        type:Number,
        unique:true,
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 

    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;