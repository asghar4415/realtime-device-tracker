import express from "express"
import { LoginController, signupController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router()



// AUTH API
router.post("/signup" , signupController)
router.post("/login" , LoginController)

router.get('/', (req, res) => {
    res.json({ message: "Hello World" });
    //login page

}
);
router.get('/signup', (req, res) => {
    res.render('signup'); 
}
);
router.get('/dashboard',authenticateToken, (req, res) => {
    res.render('dashboard', { user: req.user }); 
  
});



export default router