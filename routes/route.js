import express from "express"
import { addMember, LoginController, signupController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getUserData } from "../controllers/authController.js";

const router = express.Router()



// AUTH API
router.post("/signup" , signupController)
router.post("/login" , LoginController)


router.get('/', (req, res) => {
    res.json({ message: "Hello World" });
    //login page

}
);

router.get('/dashboard', getUserData);
router.post('/addmember', addMember);



export default router