import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Styles from "./RegisterPage.module.css"
import { FaRegUser } from "react-icons/fa"
import { MdOutlineMailOutline } from "react-icons/md"
import { MdOutlineLock } from "react-icons/md"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { FiEyeOff } from "react-icons/fi"
import formImage from "../../assets/Art.png"

const RegisterPage = () => {
  const [errors, setErrors] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.firstName) {
      newErrors.firstName = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords must match"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }
  const registerUser = async (ev) => {
    ev.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      try {
        const { confirmPassword, ...dataToSend } = formData
        await axios.post("/api/auth/register", dataToSend)
        alert("Registration successful. Now you can log in")

        setFormData({
          firstName: "",
          email: "",
          password: "",
          confirmPassword: ""
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("form validation failed")
    }
  }
  return (
    <div className={Styles.container}>
      <div className={Styles.image_div}>
        <img src={formImage} alt="logo" />
        <h1>Welcome aboard my friend</h1>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className={Styles.form_div}>
        <div className={Styles.formContainer}>
          <h2>Register</h2>
          <form className={Styles.form} onSubmit={registerUser}>
            <div className={Styles.inputField}>
              <FaRegUser className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type="text"
                name="firstName"
                placeholder="Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            {errors.firstName && (
              <div className={Styles.error}>{errors.firstName}</div>
            )}
            <div className={Styles.inputField}>
              <MdOutlineMailOutline className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <div className={Styles.error}>{errors.email}</div>}
            <div className={Styles.inputField}>
              <MdOutlineLock className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              {showPassword ? (
                <MdOutlineRemoveRedEye
                  onClick={() => setShowPassword(!showPassword)}
                  className={Styles.passIcons}
                />
              ) : (
                <FiEyeOff
                  onClick={() => setShowPassword(!showPassword)}
                  className={Styles.passIcons}
                />
              )}
            </div>
            {errors.password && (
              <div className={Styles.error}>{errors.password}</div>
            )}
            <div className={Styles.inputField}>
              <MdOutlineLock className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {showConfirm ? (
                <MdOutlineRemoveRedEye
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={Styles.passIcons}
                />
              ) : (
                <FiEyeOff
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={Styles.passIcons}
                />
              )}
            </div>
            {errors.confirmPassword && (
              <div className={Styles.error}>{errors.confirmPassword}</div>
            )}
            <button id={Styles.regBtn}>Register</button>
          </form>
          <div className={Styles.bottomInput}>
            <p>Have an account?</p>
            <Link to={"/"} className={Styles.bottom_log}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegisterPage
