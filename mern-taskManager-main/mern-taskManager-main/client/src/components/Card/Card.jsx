import React, { useContext, useEffect, useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import Styles from "./Card.module.css"
import { UserContext } from "../../context/UserContext"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { format, parseISO, isPast } from "date-fns"
import DeletePopup from "../DeletePopup/DeletePopup"
import TodoPopUp from "../TodoPopUp/TodoPopUp"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Card = ({ card, section }) => {
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.currentUser)
  const {
    setToDoCards,
    setDelSelectId,
    setShowCheckPopup,
    setShowDelPopup,
    setBacklogCards,
    setInProgress,
    setDoneCards,
    setTitle,
    setDuedate,
    setPriority,
    setInputs,
    setSelectedId,
    openDropdownIds,
    setOpenDropdownIds,
    refresh,
    setRefresh
  } = useContext(UserContext)

  useEffect(() => {
    const fetchCards = async (status) => {
      try {
        const { data } = await axios.get(
          `/api/cards/allCards?status=${status}&userId=${currentUser._id}`
        )
        if (status === "To Do") setToDoCards(data)
        else if (status === "BACKLOG") setBacklogCards(data)
        else if (status === "DONE") setDoneCards(data)
        else if (status === "PROGRESS") setInProgress(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCards("To Do")
    fetchCards("BACKLOG")
    fetchCards("DONE")
    fetchCards("PROGRESS")
  }, [refresh])

  const toggleDropdown = (id, section) => {
    if (openDropdownIds[section].includes(id)) {
      setOpenDropdownIds({
        ...openDropdownIds,
        [section]: openDropdownIds[section].filter((openId) => openId !== id)
      })
    } else {
      setOpenDropdownIds({
        ...openDropdownIds,
        [section]: [...openDropdownIds[section], id]
      })
    }
  }

  const togglePopup = (id) => {
    const newShowPopup = Object.keys(showPopup).reduce((result, key) => {
      result[key] = false
      return result
    }, {})

    newShowPopup[id] = !showPopup[id]

    setShowPopup(newShowPopup)
  }

  const updateCardStatus = async (card, newStatus) => {
    await axios
      .put(`api/cards/status/${card}`, { status: newStatus })
      .then(() => {
        setRefresh(!refresh)
      })
  }

  const handleDelete = (id) => {
    setDelSelectId(id)
    togglePopup(id)
    setShowDelPopup(true)
  }

  const handleUpdate = async (id) => {
    setSelectedId(id)
    const response = await axios.get(`/api/cards/card/${id}`)
    const cardData = response.data

    setTitle(cardData.title)
    setPriority(cardData.priority)
    setDuedate(cardData.duedate)
    setInputs(cardData.inputs)

    togglePopup(id)
    setShowCheckPopup(true)
  }

  const handleShare = async (id) => {
    navigate(`/info/${id}`)
    togglePopup(id)
    const infoUrl = `${window.location.origin}/info/${id}`
    navigator.clipboard
      .writeText(infoUrl)
      .then(() => {
        toast.success("URL copied to clipboard")
      })
      .catch((err) => {
        toast.error("Could not copy URL:", err)
      })
  }

  const handleCss = (p) => {
    switch (p) {
      case "HIGH PRIORITY":
        return Styles.highPriority
      case "MODERATE PRIORITY":
        return Styles.mediumPriority
      case "LOW PRIORITY":
        return Styles.lowPriority
      default:
        return {}
    }
  }

  const calcLen = (c) => {
    return c.inputs.filter((i) => {
      return i.checked === true
    })
  }
  return (
    <div>
      {card.length > 0 &&
        card.map((c) => (
          <div className={Styles.card} key={uuidv4()}>
            <div className={Styles.card_top}>
              <div className={Styles.card_lables}>
                <div id={Styles.prior}>
                  {c.priority !== "" && (
                    <span className={handleCss(c.priority)}>&bull;</span>
                  )}
                  <p>{c.priority}</p>
                </div>
                <div className={Styles.threeDot}>
                  <BsThreeDots onClick={() => togglePopup(c._id)} />
                </div>
              </div>
              {showPopup[c._id] && (
                <div className={Styles.popup_inner}>
                  <p onClick={() => handleUpdate(c._id)}>Edit</p>
                  <p onClick={() => handleShare(c._id)}>Share</p>
                  <p className={Styles.del} onClick={() => handleDelete(c._id)}>
                    Delete
                  </p>
                </div>
              )}
            </div>
            <DeletePopup cardId={c._id} />
            <div className={Styles.card_title}>{c.title}</div>
            <div>
              <button
                className={Styles.dropdown}
                onClick={() => toggleDropdown(c._id, section)}
              >
                Checklist ({calcLen(c).length}/{c.inputs.length}){" "}
                <span id={Styles.arrow}>
                  {openDropdownIds[section].includes(c._id) ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </span>
              </button>
              {openDropdownIds[section].includes(c._id) && (
                <ul className={Styles.dropdownItems}>
                  {c.inputs.map((item) => (
                    <div key={uuidv4()} className={Styles.items}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        className={Styles.checkbox}
                        readOnly
                      />
                      {item.value}
                    </div>
                  ))}
                </ul>
              )}
            </div>
            <TodoPopUp />
            <div className={Styles.card_footer}>
              {" "}
              {typeof c?.duedate === "string" ? (
                <div
                  className={`${Styles.date} ${
                    isPast(parseISO(c?.duedate)) ? Styles.overdue : ""
                  } ${c.status === "DONE" ? Styles.doneCol : ""}`}
                >
                  {format(parseISO(c?.duedate), "MMM do")}
                </div>
              ) : (
                <div
                  className={Styles.date}
                  style={{ backgroundColor: "#fff" }}
                ></div>
              )}
              <div className={Styles.card_tab}>
                {section !== "todo" && (
                  <div onClick={() => updateCardStatus(c._id, "To Do")}>
                    TO DO
                  </div>
                )}
                {section !== "backlog" && (
                  <div onClick={() => updateCardStatus(c._id, "BACKLOG")}>
                    BACKLOG
                  </div>
                )}
                {section !== "progress" && (
                  <div onClick={() => updateCardStatus(c._id, "PROGRESS")}>
                    PROGRESS
                  </div>
                )}
                {section !== "done" && (
                  <div onClick={() => updateCardStatus(c._id, "DONE")}>
                    DONE
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Card
