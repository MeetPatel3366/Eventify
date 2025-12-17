const express=require("express")
const { register, login, verify, verifyOtp } = require("../controllers/UserController")
const router=express.Router()

router.post("/register",register)

router.post("/login",login)

router.post("/verify-otp", verifyOtp);

router.get("/verify",verify)

module.exports=router