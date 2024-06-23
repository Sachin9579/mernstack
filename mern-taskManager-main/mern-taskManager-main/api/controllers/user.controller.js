import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { errorHandler } from "../utils/error.js"
const bcryptSalt = bcrypt.genSaltSync(10)
export const test = (req, res) => {
  res.json({ message: "Hello World" })
}

export const updateUser = async (req, res, next) => {
  const { firstName, password, oldPassword } = req.body
  console.log(firstName, password, oldPassword)
  const { id } = req.params
  const users = await User.findById(id)
  let isUpdated = false
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"))
  try {
    if (firstName) {
      users.firstName = firstName
      isUpdated = true
    }
    if (oldPassword) {
      const validPassword = bcrypt.compareSync(oldPassword, users.password)
      if (!validPassword) {
        res.status(422).json("pass not ok")
      } else if (password) {
        users.password = bcrypt.hashSync(password, bcryptSalt)
        isUpdated = true
      }
    }

    await users.save()
    if (isUpdated) {
      res.status(200).json({ msg: "User updated successfully" })
    } else {
      res.status(422).json({ msg: "No updates were made" })
    }
  } catch (error) {
    next(error)
  }
}
