import {body,validationResult} from "express-validator";
import type {Request,Response,NextFunction} from "express";

export const userValidators=[
    body("name").isString().withMessage("Name must be a string").bail().trim().notEmpty().withMessage("Name is required"),
    body("email").isString().withMessage("Email must be a string").bail().trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address"),
    body("password").isString().withMessage("Email must be a string").bail().isLength({min:8}).withMessage("Password must be at least 8 characters long"),

    (req:Request,res:Response,next:NextFunction)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                errors:errors.array(),
            });
        }
        next();
    },
];

export const loginValidators = [
    body("email")
        .isString()
        .withMessage("Email must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Enter a valid email address"),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .bail()
        .notEmpty()
        .withMessage("Password is required"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        next();
    },
];