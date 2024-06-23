import Styles from "../registerPage/RegisterPage.module.css"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { MdOutlineMailOutline } from "react-icons/md"
import { MdOutlineLock } from "react-icons/md"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { FiEyeOff } from "react-icons/fi"
import formImage from "../../assets/Art.png"
import {
  signInStart,
  signInFailure,
  signInSuccess
} from "../../redux/user/userSlice"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  async function handleLoginSubmit(ev) {
    ev.preventDefault()
    dispatch(signInStart())
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message))
        return
      }
      dispatch(signInSuccess(response.data))
      navigate("/dashboard")
    } catch (error) {
      dispatch(signInFailure(error.response.data.message))
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
          <h2>Login</h2>
          <form className={Styles.form} onSubmit={handleLoginSubmit}>
            <div className={Styles.inputField}>
              <MdOutlineMailOutline className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Email"
              />
            </div>
            <div className={Styles.inputField}>
              <MdOutlineLock className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Password"
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
            <button id={Styles.regBtn}>
              {loading ? "loading..." : "Login"}
            </button>
          </form>

          <div className={Styles.bottomInput}>
            <p>Have no account yet?</p>
            <Link to={"/register"} className={Styles.bottom_log}>
              Register now
            </Link>
          </div>
          {error && <p className={Styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
