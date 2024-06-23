import Styles from "./SettingsPage.module.css"
import axios from "axios"
import { useState } from "react"
import { MdOutlineLock } from "react-icons/md"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { FiEyeOff } from "react-icons/fi"
import { FaRegUser } from "react-icons/fa"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SettingsPage = () => {
  const [name, setName] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const currentUser = useSelector((state) => state.user.currentUser)

  const handleUpdate = async (event) => {
    event.preventDefault()
    const updatedUser = {}
    if (name) updatedUser.firstName = name
    if (newPassword) updatedUser.password = newPassword
    if (oldPassword) updatedUser.oldPassword = oldPassword

    try {
      const response = await axios.put(
        `/api/user/update/${currentUser._id}`,
        updatedUser
      )

      if (response.status === 200) {
        toast.success("User updated successfully")
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        toast.error("Old Password is incorrect")
      }
    }

    setNewPassword("")
    setOldPassword("")
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.form_div}>
        <div className={Styles.formContainer}>
          <h2>Settings</h2>
          <form className={Styles.form} onSubmit={handleUpdate}>
            <div className={Styles.inputField}>
              <FaRegUser className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type="text"
                defaultValue={currentUser.firstName}
                placeholder="Name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
            <div className={Styles.inputField}>
              <MdOutlineLock className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type={showPassword ? "text" : "password"}
                onChange={(ev) => setOldPassword(ev.target.value)}
                placeholder="Old Password"
                value={oldPassword}
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
            <div className={Styles.inputField}>
              <MdOutlineLock className={Styles.icons} />
              <input
                className={Styles.mainInput}
                type={showConfirm ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
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
            {/* <p>{error}</p> */}
            <button id={Styles.regBtn}>Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
