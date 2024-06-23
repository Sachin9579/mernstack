import Styles from "./Logout.module.css"
import { useDispatch } from "react-redux"
import axios from "axios"
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess
} from "../../redux/user/userSlice"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

const Logout = () => {
  const { showLogPopup, setShowLogPopup } = useContext(UserContext)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    setShowLogPopup(false)
    try {
      dispatch(signOutUserStart())
      const res = await axios.get("/api/auth/logout")
      if (res.data.success === false) {
        dispatch(signOutUserFailure(res.data.message))
        return
      }
      dispatch(signOutUserSuccess(res.data))
    } catch (error) {
      dispatch(signOutUserFailure(error.res.data.message))
    }
  }
  if (!showLogPopup) {
    return null
  }

  return (
    <div className={Styles.main_log}>
      <div className={Styles.popup_inner}>
        <p>Are you sure you want to Logout?</p>
        <div>
          <p id={Styles.logout} onClick={handleLogout}>
            Yes, Logout
          </p>
          <p id={Styles.cancel} onClick={() => setShowLogPopup(false)}>
            Cancel
          </p>
        </div>
      </div>
    </div>
  )
}

export default Logout
