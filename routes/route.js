import express from "express";

import { addMember, LoginController, signupController, getUserData, turnONlive, turnOFFlive } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router()



// AUTH API
router.post("/signup" , signupController)
router.post("/login" , LoginController)


router.get('/', (req, res) => {
    res.json({ message: "Hello World" });   
}
);

router.get('/dashboard', getUserData);
router.post('/addmember', addMember);
router.post('/golive', turnONlive);
router.post('/endlive', turnOFFlive);



export default router