const { Router } = require("express");
const router = Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
