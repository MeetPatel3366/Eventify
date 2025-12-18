const express=require("express")
const { register, login, verify, verifyOtp, verifyLoginOtp, getGoogleLoginPage } = require("../controllers/UserController")
const router=express.Router()

router.post("/register",register)

router.post("/login",login)

router.get("/google",getGoogleLoginPage)

router.post("/verify-otp", verifyOtp);

router.post("/verify-login-otp",verifyLoginOtp)

router.get("/verify",verify)

module.exports=router