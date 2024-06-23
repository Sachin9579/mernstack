import Styles from "./Board.module.css"
import { FaPlus } from "react-icons/fa"
import { BiWindows } from "react-icons/bi"
import Card from "../Card/Card"
import TodoPopUp from "../TodoPopUp/TodoPopUp"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

const Board = ({ name, section }) => {
  const {
    setShowCheckPopup,
    toDoCards,
    backlogCards,
    inProgress,
    doneCards,
    setOpenDropdownIds
  } = useContext(UserContext)

  const closeDropdowns = (section) => {
    setOpenDropdownIds((prevState) => ({
      ...prevState,
      [section]: []
    }))
  }

  return (
    <div className={Styles.board}>
      <div className={Styles.top}>
        <p className={Styles.title}>{name}</p>

        {name === "To do" && (
          <FaPlus
            onClick={() => setShowCheckPopup(true)}
            className={Styles.collapse}
          />
        )}
        <BiWindows
          onClick={() => closeDropdowns(section)}
          className={Styles.collapse}
        />
      </div>
      <div className={`${Styles.cards} ${Styles.scroll}`}>
        {name === "To do" && <Card card={toDoCards} section="todo" />}
        {name === "Backlog" && <Card card={backlogCards} section="backlog" />}
        {name === "In Progress" && (
          <Card card={inProgress} section="progress" />
        )}
        {name === "Done" && <Card card={doneCards} section="done" />}
      </div>

      <TodoPopUp />
    </div>
  )
}

export default Board
