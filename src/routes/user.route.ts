import { Router } from "express";
import { registerUser,loginUser,getProfile,updateProfile,deleteUser} from "../controllers/user.controllers.js";
import { userValidators,loginValidators } from "../validators/user.validators.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router=Router();

router.post("/register",userValidators,registerUser);
router.post("/login", loginValidators, loginUser);
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.delete("/profile", authenticateUser, deleteUser);


export default router;