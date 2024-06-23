import React, { useContext, useState } from "react"
import Styles from "./Dashboard.module.css"
import Board from "../../components/Board/Board"
import { IoIosArrowDown } from "react-icons/io"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import axios from "axios"
import { UserContext } from "../../context/UserContext"

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Week")
  const { setToDoCards, setBacklogCards, setDoneCards, setInProgress } =
    useContext(UserContext)
  const [datePopup, setDatePopup] = useState(false)
  const date = new Date()
  const formattedDate = format(date, "do MMM yyyy")

  const getCards = async (timeframe) => {
    setDatePopup(!datePopup)
    try {
      const { data } = await axios.get(
        `/api/cards/sortCards?timeframe=${timeframe}&userId=${currentUser._id}`
      )
      setToDoCards(data.filter((card) => card.status === "To Do"))
      setBacklogCards(data.filter((card) => card.status === "BACKLOG"))
      setDoneCards(data.filter((card) => card.status === "DONE"))
      setInProgress(data.filter((card) => card.status === "PROGRESS"))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={Styles.container}>
        <nav>
          <h1>Welcome! {currentUser ? currentUser.firstName : "Guest"}</h1>
          <p>{formattedDate}</p>
        </nav>
        <div className={Styles.title}>
          <h2>Board</h2>
          <div className={Styles.title_left}>
            <p>{selectedTimeframe}</p>
            <IoIosArrowDown
              onClick={() => setDatePopup(!datePopup)}
              className={Styles.pointer}
            />
            {datePopup && (
              <div className={Styles.popup_inner}>
                <p
                  className={Styles.pointer}
                  onClick={() => {
                    getCards("today")
                    setSelectedTimeframe("Today")
                  }}
                >
                  Today
                </p>
                <p
                  className={Styles.pointer}
                  onClick={() => {
                    getCards("week")
                    setSelectedTimeframe("This Week")
                  }}
                >
                  This Week
                </p>
                <p
                  className={Styles.pointer}
                  onClick={() => {
                    getCards("month")
                    setSelectedTimeframe("This Month")
                  }}
                >
                  This Month
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={Styles.outer_boards}>
          <div className={Styles.boards}>
            <Board name="Backlog" section="backlog" />
            <Board name="To do" section="todo" />
            <Board name="In Progress" section="progress" />
            <Board name="Done" section="done" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
