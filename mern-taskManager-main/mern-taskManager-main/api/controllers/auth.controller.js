import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { errorHandler } from "../utils/error.js"

const bcryptSalt = bcrypt.genSaltSync(10)
export const register = async (req, res, next) => {
  const { firstName, email, password } = req.body
  try {
    const userDoc = await User.create({
      firstName,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    })
    res.json(userDoc)
  } catch (error) {
    res.status(422).json(error)
    next(error)
  }
}

export const logIn = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, "User not found"))
    const validPassword = bcrypt.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(404, "Wrong Credentials"))
    const token = jwt.sign({ id: validUser._id }, process.env.jwtSecret)
    const { password: pass, ...rest } = validUser._doc
    res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const logOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json("User is logged Out")
  } catch (error) {
    next(error)
  }
}
