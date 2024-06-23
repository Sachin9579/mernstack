import express from "express"

import { logIn, register, logOut } from "../controllers/auth.controller.js"
const router = express.Router()

router.post("/register", register)
router.post("/login", logIn)
router.get("/logout", logOut)

export default router
